# Strathmore University Community Fundraising Portal
Welcome to the repository for the Strathmore University Community Fundraising Portal. This web application is designed to centralize and streamline philanthropic efforts within the Strathmore community, empowering verified members to create and support charitable campaigns.

##
NOTE
One can run the website locally once you clone the git repository.

## Group Members

* **Maina Tiffany Wanjiru**       - 189592  
* **Eniola Faithfulness Fabunmi** - 167925   
* **Mohamed Abdikadir**           - 190125
* **Ogwayo Emma Awuor**           - 189923

---

## Introduction

Strathmore University holds a strong philanthropic mandate, with its non-profit Foundation dedicated to supporting university initiatives. However, current fundraising efforts are fragmented across various informal channels like emails, events, and social media. This decentralized approach hinders campaign discovery, donation tracking, and proper oversight.

To address this, we propose a Web-based Community Fundraising Portal. This portal will centralize giving by empowering verified Strathmore community members (students, faculty, staff, and affiliated NGOs) to create and support charitable campaigns. Mirroring successful campus crowdfunding models like UC Davis’s “Crowdfund” program, our platform aims to consolidate campaigns, streamline approvals, boost visibility, and align grassroots drives with university priorities.

## Problem Statement

Strathmore's current fundraising activities suffer from a lack of a unified channel. Campaigns are informally promoted, leading to inefficiencies such as donor unawareness, conflicting solicitations, and decentralized accounting/tracking. The absence of a central system makes it challenging to enforce financial controls and ethics, risking compliance and missed community giving opportunities. A dedicated platform is needed to vet campaigns and ensure alignment with university policies, similar to the "thorough review" required at institutions like UC Davis.

## Solution Overview

We are building a secure, user-friendly web portal where verified Strathmore users can launch and manage fundraising campaigns, and donors (both internal and external, as allowed) can contribute online. Key components of this solution include:

* **Authentication:** Robust user authentication for students, faculty, and staff (with optional integration via the university’s CAS/LDAP system for single sign-on).
* **Admin Approval Workflow:** A structured process for administrators to review and approve new campaigns.
* **Rich Campaign Pages:** Engaging campaign pages featuring clear goals, detailed descriptions, dynamic progress bars, and multimedia content (photos/videos).
* **Integrated Payment Processing:** Support for online contributions, including Lipa Na M-Pesa (via Daraja API for production) and international card payments (Stripe or PayPal).
* **Donation Tracking & Reporting:** Comprehensive logging of all transactions and reporting capabilities for administrators to monitor overall donation metrics.
* **Automated Notifications:** Donors will receive automatic confirmations (emails/texts) upon successful contributions.

By aggregating all fundraising drives (scholarships, peer aid, community projects, NGO partnerships, etc.), the portal will provide Strathmore’s Advancement Office and Student Affairs with real-time insights into campus giving.

## Core Feature Set

The portal will include the following essential features, aligning with modern fundraising platform standards:

* **Campaign Creation & Management:**
    * Verified users can initiate new campaigns with a title, detailed description, funding goal, and duration.
    * Campaign pages will feature a dynamic progress bar tracking funds raised versus the target.
    * Creators can post updates/news and attach images or videos to enhance their story.
* **Secure Donation Processing:**
    * Integrated payment gateway for seamless contributions.
    * Implementation of Lipa Na M-Pesa (Safaricom’s Daraja API) for local payments.
    * Integration with international payment processors (Stripe or PayPal) for card payments.
    * All transactions will be recorded with their status, and donors will receive digital receipts.
* **Role-Based Access Control:**
    * **Administrators:** Can approve/reject campaigns, manage categories, and access comprehensive donation reports.
    * **Campaign Creators (Student/Staff/Faculty):** Can create and edit their campaigns, post updates, and view donations specific to their projects.
    * **Donors:** Can browse campaigns, follow initiatives, make contributions, and view their personal donation history.
    * *(Optional)* User identity verification potentially linked to Strathmore’s campus directory via CAS/LDAP.
* **Admin Panel & Moderation:**
    * A secure backend interface for university staff to review pending campaigns.
    * Admins can set campaign status, assign categories/tags, and remove inappropriate content.
    * Provides analytics on funds raised across departments or categories for oversight.
* **User Dashboard:**
    * Personalized dashboards for registered users.
    * Campaign creators see their active campaigns and total funds raised.
    * Donors view their gift history and followed campaigns.
    * Automated email/SMS notifications for contributions, milestones, and messages.
* **Filtering & Visibility:**
    * Campaigns can be categorized (e.g., "Health," "Academic Projects," "Community Service") and assigned to departments.
    * Visitors can filter campaigns by category or search using keywords.
    * A "Featured Campaigns" section on the homepage will highlight curated projects to boost visibility.

## User Roles

The portal is designed to serve distinct Strathmore user groups with specific capabilities:


 | Role             | Capabilities                                                                 |
|------------------|------------------------------------------------------------------------------|
| Administrator    | Review and approve campaigns, manage categories, view reports                |
| Campaign Creator | Launch/edit campaigns, view donations, post updates, respond to donors       |
| Donor            | Browse campaigns, donate, track donation history and receipts                |
| Alumni/Public    | (Optional) Donate to public campaigns with email verification                |

---                                    

## Technologies Used

* **Frontend:**
    * React.js
    * Tailwind CSS
    * React Router DOM
    * React Share
    * React QR Code
* **Backend & Database:**
    * Firebase:
        * Firestore (NoSQL cloud database)
        * Firebase Authentication
    * (Simulated) M-Pesa Integration (Frontend-only simulation for now; full integration requires Daraja API via backend).

## Future Enhancements

* Full **Admin Dashboard** for campaign approval, user management, and detailed analytics.
* Implement **Real M-Pesa Integration** via a secure backend (e.g., Firebase Cloud Functions or a separate Node.js server) interacting with Safaricom's Daraja API.
* Enhanced **User Profiles** and personalized dashboards.
* Advanced **Search and Filtering** options for campaigns.
* In-app **Notifications** and messaging system.
* Integration with Strathmore's **CAS/LDAP** for seamless single sign-on verification.

## Getting Started

To run the project locally:

1. Clone the repository.
2. Install dependencies: npm install
3. Create a `.env` file in the root directory and add your Firebase config.
4. Start the development server: npm run dev

# Screenshots
To view screenshots of the project UI, click https://drive.google.com/drive/folders/1iwtE0OAb2jF_jN70KzyvkpwH9HfxZDn6?usp=drive_link
