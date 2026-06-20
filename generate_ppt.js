const pptxgen = require('pptxgenjs');
const path = require('path');
const os = require('os');
const fs = require('fs');

let pptx = new pptxgen();

// Define a pleasant master slide template
pptx.defineSlideMaster({
  title: 'MASTER_SLIDE',
  background: { fill: 'F8FAFC' }, // Soft, modern light grayish blue
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: 0.15, fill: { color: '3182CE' } } }, // Vibrant blue top bar
    { rect: { x: 0, y: 5.35, w: '100%', h: 0.3, fill: { color: 'E2E8F0' } } }, // Subtle gray footer
    { text: { text: 'Billware Pharmacy Software - Official Training Manual', options: { x: 0.5, y: 5.37, w: 5, h: 0.25, fontSize: 10, color: '718096' } } },
    { text: { text: 'Page | ', options: { x: 8.5, y: 5.37, w: 1, h: 0.25, fontSize: 10, color: '718096', align: 'right' } } }
  ],
  slideNumber: { x: 9.5, y: 5.37, color: '718096', fontSize: 10 }
});

const screenshotsDir = path.join(os.homedir(), 'Desktop', 'billware screenshots');
let imageFiles = [];
if (fs.existsSync(screenshotsDir)) {
    imageFiles = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
    imageFiles.sort();
    imageFiles = imageFiles.filter(f => {
        const stats = fs.statSync(path.join(screenshotsDir, f));
        return stats.size > 1000;
    });
}

const slides_data = [
    { 
        title: "Billware - Smart Billing for Every Pharmacy", 
        content: [
            { text: "Welcome to the Billware Comprehensive User Manual.\n", options: { fontSize: 24, align: 'center', color: '2D3748', bold: true } },
            { text: "This guide will walk you through every feature of the platform in deep detail, from creating your account to managing daily sales, purchases, and advanced reporting features.", options: { fontSize: 16, align: 'center', color: '4A5568' } }
        ]
    },
    { 
        title: "1. Creating a New Store Account", 
        content: [
            { text: "Purpose: This is your gateway to setting up an independent, secure digital pharmacy store.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: From the login screen, click the 'Create an account' link. You will need to choose a unique Account Username. This username is permanent and serves as the primary identifier for your database. Next, create a strong, memorable password.", options: { bullet: true, color: '4A5568' } },
            { text: "Pro Tip: Each account operates in complete isolation. This means your inventory, sales, and customer data are 100% private and inaccessible to other store owners.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "2. Signing In to Your Dashboard", 
        content: [
            { text: "Purpose: Securely access your store's dashboard to begin your daily operations.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Enter the Username and Password you established during account creation. If you are using a secure, private computer (like the main counter PC), check the 'Keep me signed in' box. Click 'Sign In' to proceed.", options: { bullet: true, color: '4A5568' } },
            { text: "Security Note: Never check 'Keep me signed in' if you are logging in from a public or shared computer to protect your sensitive financial data.", options: { bullet: true, bold: true, color: 'E53E3E' } }
        ]
    },
    { 
        title: "3. Adding a New Customer", 
        content: [
            { text: "Purpose: Build a loyal customer database for faster billing and personalized service.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Navigate to Home > Add Customer. Enter the customer's Full Name, Phone Number, and their Address or Place of residence. Fields marked with a red asterisk (*) must be filled out before saving.", options: { bullet: true, color: '4A5568' } },
            { text: "Pro Tip: Always try to capture an accurate phone number. This allows you to easily pull up the customer's purchase history in the future and send digital invoices.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "4. Adding a New Doctor", 
        content: [
            { text: "Purpose: Maintain a registry of local prescribing doctors to attach to sales bills.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Go to Home > Add Doctor. Input the Doctor's Name, Contact Number, the Clinic or Hospital they are associated with, and their Address.", options: { bullet: true, color: '4A5568' } },
            { text: "Why This Matters: Registering doctors allows you to simply select their name from a dropdown menu during a busy checkout process, saving time and allowing you to track prescriptions.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "5. Adding a Purchase (Part 1 - Bill Details)", 
        content: [
            { text: "Purpose: Record new inventory arriving from your wholesale suppliers.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Under 'Bill Details', carefully type in the supplier's exact Bill Number and their Firm Name. Select the exact Date of purchase as printed on the physical invoice.", options: { bullet: true, color: '4A5568' } },
            { text: "Efficiency Tip: If your supplier provides digital invoices, use the 'Import Medicine List' feature. This will automatically populate the items below, saving you hours of manual typing.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "6. Adding a Purchase (Part 2 - Product Details)", 
        content: [
            { text: "Purpose: Enter specific line items into your inventory system.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: For each product, enter the Name, Batch Number, Expiry Date, Quantity, MRP, Rate, and GST percentage. Click '+ Add Another Item' to insert more rows.", options: { bullet: true, color: '4A5568' } },
            { text: "Crucial Step: The Batch Number and Expiry Date MUST be perfectly accurate. The entire Expiry Checker system relies on these two fields to alert you before medicines spoil.", options: { bullet: true, bold: true, color: 'E53E3E' } }
        ]
    },
    { 
        title: "7. Creating a New Sale Bill (Header Details)", 
        content: [
            { text: "Purpose: Initiate a new customer transaction at the checkout counter.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Open the Sales page. The Bill Number and Date are generated automatically. Use the dropdown menus to select an existing Customer and the Prescribing Doctor.", options: { bullet: true, color: '4A5568' } },
            { text: "Pro Tip: If a brand new customer walks in, you do not need to leave this page! Simply click the '+ New Customer' button to register them instantly without losing your current billing progress.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "8. Creating a New Sale Bill (Medicine Details)", 
        content: [
            { text: "Purpose: Add items to the customer's cart and finalize the sale.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Search for a medicine in the dropdown and select the specific Batch Number. Type in the Quantity (Qty) being sold. Review the Grand Total, collect payment, and click 'Save Bill'.", options: { bullet: true, color: '4A5568' } },
            { text: "Automation Magic: Selecting a Batch instantly pulls the Expiry Date, Current Stock, and MRP. Always verify your 'Current Stock' is sufficient before finalizing.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "9. Viewing Reports & Analytics", 
        content: [
            { text: "Purpose: Gain high-level insights into your pharmacy's financial performance.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Choose a 'From Date' and 'To Date'. Select the 'Type' of transaction you wish to review (Sales, Purchases, etc.) and hit 'Generate'.", options: { bullet: true, color: '4A5568' } },
            { text: "Business Intelligence: The four summary cards are your dashboard. The 'Net Profit' card is an instant health check, showing exactly what you've earned after purchase costs are deducted.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "10. Monitoring Medicine Stock", 
        content: [
            { text: "Purpose: Track exactly how much of every product you have on your shelves.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Click on 'Medicine Stock Report'. Search for items by Name or Batch. Look at 'Total In' vs 'Total Out' to see movement, and check 'Current Stock' for your physical inventory.", options: { bullet: true, color: '4A5568' } },
            { text: "Inventory Control: Use the quick filters ('Low Stock' and 'Out of Stock') daily. This creates an instant shopping list for your suppliers, ensuring you never turn a customer away.", options: { bullet: true, bold: true, color: 'E53E3E' } }
        ]
    },
    { 
        title: "11. Medicine Expiry Checker", 
        content: [
            { text: "Purpose: Prevent financial losses by identifying medicines before they expire.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Open the Expiry Checker. Select a predictive timeframe like 'This Month', '1 Month', or '2 Months' into the future, then click 'Check Now'.", options: { bullet: true, color: '4A5568' } },
            { text: "Proactive Management: By checking 2 months in advance, you have enough time to either return the stock to your distributor for a refund, or place it on discount to clear it out.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "12. Transaction Records", 
        content: [
            { text: "Purpose: Review a chronological audit log of everything happening in your store.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Browse through the unified list of Sales and Purchases. Use the top filters to isolate just Sales or just Purchases. Note the total values summarized at the top.", options: { bullet: true, color: '4A5568' } },
            { text: "Error Correction: If you realize a mistake was made on a previous bill, find the transaction here and click the red trash icon to delete it and return the stock to your inventory.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "13. Inbox & Notifications Overview", 
        content: [
            { text: "Purpose: A centralized hub for all system alerts, warnings, and messages.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Click the bell icon to open the Inbox. The 'All' tab shows a feed of every notification. Use 'Mark all read' to clear your queue once you have handled the issues.", options: { bullet: true, color: '4A5568' } },
            { text: "Visual Cues: Pay close attention to the colors. Red notifications demand immediate attention (like a critical stockout), while Orange acts as a warning for future events.", options: { bullet: true, bold: true, color: 'E53E3E' } }
        ]
    },
    { 
        title: "14. Managing Medicine Alerts", 
        content: [
            { text: "Purpose: A dedicated channel just for inventory-related urgencies.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Navigate to the 'Medicines' tab within the Inbox. This filters out general business news and only shows you items that are 'Expiring Soon' or 'Out of Stock'.", options: { bullet: true, color: '4A5568' } },
            { text: "Daily Routine: Make it a habit to check this specific tab first thing in the morning. It acts as your daily to-do list for restocking the shelves and pulling expired boxes.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "15. Tracking Business Updates", 
        content: [
            { text: "Purpose: Stay motivated and informed about your store's operational milestones.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Switch to the 'Business' tab in the Inbox. Here you will see congratulatory messages for hitting sales targets, summaries of daily performance, and operational alerts.", options: { bullet: true, color: '4A5568' } },
            { text: "Why It Matters: These alerts help you keep your finger on the pulse of the business without having to dig through dense reports and spreadsheets.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "16. System Updates & Announcements", 
        content: [
            { text: "Purpose: Communication directly from the Billware software team.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Check the 'Updates' tab periodically. This is where you will read release notes, discover new features that have been added, and learn about any scheduled maintenance.", options: { bullet: true, color: '4A5568' } },
            { text: "Pro Tip: Reading these updates ensures you are getting the most value out of Billware by utilizing the latest tools designed to make your life easier.", options: { bullet: true, bold: true, color: '3182CE' } }
        ]
    },
    { 
        title: "17. Managing Shop Settings", 
        content: [
            { text: "Purpose: Configure the legal and visual identity of your pharmacy.", options: { bullet: true, bold: true, color: '2D3748' } },
            { text: "Key Actions: Navigate to Settings. Input your Store Name, Address, and Contact numbers. Add legal details like your Drug Licence No and GSTIN. Customize the footer message for receipts.", options: { bullet: true, color: '4A5568' } },
            { text: "Compliance Warning: The information saved here is printed on every single invoice you hand to a customer. It is a strict legal requirement that your GSTIN and Drug License numbers are completely accurate.", options: { bullet: true, bold: true, color: 'E53E3E' } }
        ]
    }
];

// Map images to slides
for (let i = 1; i < slides_data.length; i++) {
    if (i - 1 < imageFiles.length) {
        slides_data[i].screenshotPath = path.join(screenshotsDir, imageFiles[i-1]);
    }
}

// Set up master slide layout
pptx.layout = 'LAYOUT_16x9';

// Title Slide
let titleSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
titleSlide.addText(slides_data[0].title, { x: 0.5, y: 1.8, w: 9, h: 1, fontSize: 36, bold: true, align: 'center', color: '1A365D' });
titleSlide.addText(slides_data[0].content, { x: 0.5, y: 3.0, w: 9, h: 1.5 });

// Content Slides
for (let i = 1; i < slides_data.length; i++) {
    let s = slides_data[i];
    let newSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    
    // Add title
    newSlide.addText(s.title, { x: 0.5, y: 0.25, w: 9, h: 0.4, fontSize: 24, bold: true, color: '2B6CB0', align: 'left' });
    
    // Add Image perfectly aligned
    if (s.screenshotPath && fs.existsSync(s.screenshotPath)) {
        newSlide.addImage({ path: s.screenshotPath, x: 0.5, y: 0.75, w: 9, h: 3.3, sizing: {type: 'contain'} });
    } else {
        newSlide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.75, w: 9, h: 3.3, fill: { color: 'E2E8F0' } });
        newSlide.addText("[ Missing Screenshot ]", { x: 0.5, y: 0.75, w: 9, h: 3.3, fontSize: 18, align: 'center', color: 'A0AEC0' });
    }
    
    // Add Instructions text aligned perfectly below the image
    newSlide.addText(s.content, { 
        x: 0.4, 
        y: 4.15, 
        w: 9.2, 
        h: 1.1, 
        fontSize: 11.5, 
        color: '363636', 
        valign: 'top',
        align: 'left',
        margin: 5,
        lineSpacing: 14
    });
}

const desktopPath = path.join(os.homedir(), 'Desktop', 'Billware_User_Instructions_Pleasant.pptx');

pptx.writeFile({ fileName: desktopPath })
    .then(fileName => {
        console.log(`Created file: ${fileName}`);
    })
    .catch(err => {
        console.error(err);
    });
