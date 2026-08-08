import mongoose from 'mongoose';

const agreementTemplateSchema = new mongoose.Schema(
    {
        templateName: { type: String, required: true },
        templateKey: { type: String, required: true }, // e.g., 'B2B_ACCEPTANCE_EXECUTION'
        moduleType: { type: String, required: true, enum: ['B2B', 'Vendor', 'Delivery', 'Customer', 'Admin', 'Common'] },
        description: { type: String },
        url: { type: String, required: true },
        fileName: { type: String, required: true },
        mimeType: { type: String },
        fileSize: { type: Number },
        status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
        version: { type: Number, default: 1 },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
    },
    { timestamps: true }
);

// Index for quick queries
agreementTemplateSchema.index({ templateKey: 1, status: 1 });

const AgreementTemplate = mongoose.model('AgreementTemplate', agreementTemplateSchema);
export default AgreementTemplate;
