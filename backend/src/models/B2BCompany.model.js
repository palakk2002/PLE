import mongoose from 'mongoose';

const b2bCompanySchema = new mongoose.Schema(
    {
        companyName: { 
            type: String, 
            required: true, 
            trim: true 
        },
        gstNumber: { 
            type: String, 
            required: true, 
            trim: true 
        },
        businessEmail: { 
            type: String, 
            required: true, 
            trim: true, 
            lowercase: true 
        },
        businessPhone: { 
            type: String, 
            required: true, 
            trim: true 
        },
        companyAddress: { 
            type: String, 
            required: true, 
            trim: true 
        },
        companyType: { 
            type: String, 
            required: true,
            enum: [
                'Proprietorship',
                'Partnership Firm',
                'LLP (Limited Liability Partnership)',
                'Private Limited Company',
                'Public Limited Company',
                'One Person Company (OPC)',
                'Other'
            ]
        },
        website: { 
            type: String, 
            trim: true 
        },
        verificationStatus: { 
            type: String, 
            enum: ['Pending Verification', 'Approved', 'Rejected', 'Suspended'], 
            default: 'Pending Verification' 
        },
        status: { 
            type: String, 
            enum: ['Active', 'Inactive'], 
            default: 'Active' 
        }
    },
    { timestamps: true }
);

const B2BCompany = mongoose.model('B2BCompany', b2bCompanySchema);
export default B2BCompany;
