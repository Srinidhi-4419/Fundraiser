const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create Nodemailer transporter with app-specific password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_APP_PASSWORD // App-specific password
    }
});

/**
 * Endpoint to send a message to a fundraiser
 * Validates input and sends an email
 */
router.post('/fundraiser/send-message', [
    // Validation middleware
    body('fundraiserEmail')
        .isEmail().withMessage('Invalid fundraiser email')
        .normalizeEmail(),
    body('senderEmail')
        .isEmail().withMessage('Invalid sender email')
        .normalizeEmail(),
    body('senderName')
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Sender name must be 2-50 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Message must be between 10 and 1000 characters')
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }

    try {
        const { 
            fundraiserEmail, 
            senderEmail, 
            senderName, 
            message 
        } = req.body;

        // Prepare email options
        const mailOptions = {
            from: {
                name: 'Fundraiser Platform',
                address: process.env.EMAIL_USER
            },
            to: fundraiserEmail,
            subject: `New Message About Your Fundraiser`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
                    <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #2ecc71;">New Message Received</h2>
                        <p style="color: #333;">You have received a new message regarding your fundraiser.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2ecc71; margin: 20px 0;">
                            <p style="margin: 0; color: #555;"><strong>Message:</strong></p>
                            <p style="margin: 5px 0; color: #333;">${message}</p>
                        </div>
                        
                        <div style="margin-top: 20px;">
                            <p style="color: #666; font-size: 14px;">
                                <strong>Sender Name:</strong> ${senderName}<br>
                                <strong>Sender Email:</strong> ${senderEmail}
                            </p>
                        </div>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">
                            This is an automated message. Please do not reply directly to this email.
                        </p>
                    </div>
                </div>
            `,
            // Optional: Add reply-to to encourage direct communication
            replyTo: senderEmail
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully to fundraiser' 
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later.' 
        });
    }
});

module.exports = router;