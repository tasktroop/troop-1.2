# LeadOS Live Demo Script

Follow this explicit step-by-step roadmap when running presentations.

**Prerequisites:** Database populated, `.env` verified.

### 1. Registration
- **Action:** Open application, click Sign up. Enter "Demo Co" and generic emails mapping standard Admin role.
- **Expected UI:** Smooth transition to `/dashboard` directly presenting generic placeholder metrics successfully seamlessly.

### 2. Manual Lead Insertion
- **Action:** Navigate to Leads -> Click "+ Add Lead". Enter `Raj Sharma`, `+91-9876543210`, Stage: `New`. Save.
- **Expected UI:** Table updates via optimistic UI adding Raj safely. Stage badge matches `New`.

### 3. AI Drafting
- **Action:** Open Raj's detailed profile natively clicking the AI actions wrapper hitting "Generate AI Draft".
- **Expected UI:** System maps specific `gpt-4o` token calls capturing context safely outputting accurate "Greeting" contexts seamlessly!

### 4. Approval Engine Triggers
- **Action:** Since we act as Agents inherently simulating flows natively, click "Request Approval".
- **Expected UI:** Draft shifts states explicitly. Sidebar Approval badge increments dynamically universally.

### 5. Administrative Overrides
- **Action:** Navigate to the Approvals Queue explicitly representing Admin context. Select "Approve" mapping correct draft.
- **Expected UI:** The row is instantly purged mapping Optimistic responses. Lead pipeline states automatically advance correctly mapping the "Contacted" logic!

### 6. WhatsApp Dispatch
- **Action:** Navigate back to Raj's lead natively. Click "Send via WhatsApp".
- **Expected UI:** The API fires successfully. (Check Twilio mocks / real flows securely capturing successful outbound).

### 7. Social Marketing
- **Action:** Open Social targeting tomorrow logically. Schedule Instagram "Summer Sale 100% Guaranteed!"
- **Expected UI:** AI intercepts the draft natively generating caption options safely. Submits securely to Buffer APIs storing pending states.

### 8. Analytics Verification
- **Action:** Open Analytics.
- **Expected UI:** Total AI generated trace metric counts correctly match the explicit 60 token impacts representing Razorpay intercepts natively. Conversion Rates adapt based on internal structures correctly!
