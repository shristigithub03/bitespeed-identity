import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber required" });
  }

  try {
    // 1️⃣ Find matching contacts
    const existingResult = await pool.query(
      `
      SELECT * FROM contact
      WHERE email = $1 OR phonenumber = $2
      `,
      [email || null, phoneNumber || null]
    );

    let existingContacts = existingResult.rows;

    // 2️⃣ If none exist → create primary
    if (existingContacts.length === 0) {
      const created = await pool.query(
        `
        INSERT INTO contact (email, phonenumber, linkPrecedence, createdAt, updatedAt)
        VALUES ($1, $2, 'primary', NOW(), NOW())
        RETURNING *
        `,
        [email || null, phoneNumber || null]
      );

      const row = created.rows[0];

      return res.status(200).json({
        contact: {
          primaryContatctId: row.id,
          emails: row.email ? [row.email] : [],
          phoneNumbers: row.phonenumber ? [row.phonenumber] : [],
          secondaryContactIds: [],
        },
      });
    }

    // 3️⃣ Collect all linked contacts recursively
    const contactIds = existingContacts.map((c) => c.id);

    const linkedResult = await pool.query(
      `
      SELECT * FROM contact
      WHERE id = ANY($1)
         OR linkedid = ANY($1)
      `,
      [contactIds]
    );

    existingContacts = linkedResult.rows;

    // 4️⃣ Identify all primaries
    const primaries = existingContacts.filter(
      (c) => c.linkprecedence === "primary"
    );

    // 5️⃣ Sort primaries by createdAt (oldest first)
    primaries.sort(
      (a, b) =>
        new Date(a.createdat).getTime() -
        new Date(b.createdat).getTime()
    );

    const oldestPrimary = primaries[0];

    // 6️⃣ Convert other primaries to secondary
    for (let i = 1; i < primaries.length; i++) {
      await pool.query(
        `
        UPDATE contact
        SET linkPrecedence = 'secondary',
            linkedId = $1,
            updatedAt = NOW()
        WHERE id = $2
        `,
        [oldestPrimary.id, primaries[i].id]
      );
    }

    // 7️⃣ Check if new info is present
    const emailExists = existingContacts.some((c) => c.email === email);
    const phoneExists = existingContacts.some(
      (c) => c.phonenumber === phoneNumber
    );

    if (!emailExists || !phoneExists) {
      await pool.query(
        `
        INSERT INTO contact (email, phonenumber, linkPrecedence, linkedId, createdAt, updatedAt)
        VALUES ($1, $2, 'secondary', $3, NOW(), NOW())
        `,
        [email || null, phoneNumber || null, oldestPrimary.id]
      );
    }

    // 8️⃣ Fetch final merged contacts
    const finalResult = await pool.query(
      `
      SELECT * FROM contact
      WHERE id = $1 OR linkedid = $1
      `,
      [oldestPrimary.id]
    );

    const contacts = finalResult.rows;

    const emails = [
      ...new Set(
        contacts
          .map((c) => c.email)
          .filter(Boolean)
      ),
    ];

    const phoneNumbers = [
      ...new Set(
        contacts
          .map((c) => c.phonenumber)
          .filter(Boolean)
      ),
    ];

    const secondaryContactIds = contacts
      .filter((c) => c.linkprecedence === "secondary")
      .map((c) => c.id);

    return res.status(200).json({
      contact: {
        primaryContatctId: oldestPrimary.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;