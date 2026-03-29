const Company = require('../models/company');
const User = require('../models/user');

const companyController = {
    getAllCompanies: async (req, res) => {
        try {
            const companies = await Company.findAll();
            res.json({ success: true, data: companies });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getCompanyByID: async (req, res) => {
        try {
            const company = await Company.findByPk(req.params.companyID);
            if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
            res.json({ success: true, data: company });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateCompany: async (req, res) => {
        try {
            const companyID = req.params.companyID;
            const updateData = { ...req.body, updatedOn: new Date() };
            
            await Company.update(updateData, { where: { companyID } });
            
            // Sync Admin to User Table
            if (updateData.adminName && updateData.adminPhone) {
                const [adminUser, created] = await User.findOrCreate({
                    where: { companyID: companyID, role: 'admin' },
                    defaults: {
                        name: updateData.adminName,
                        phoneNumber: updateData.adminPhone,
                        companyID: companyID,
                        location: updateData.adminLocation || updateData.location || '',
                        category: updateData.adminCategory || updateData.category || 'Builders',
                        isActive: 1,
                        password: 'Password#1',
                        createdOn: new Date(),
                        updatedOn: new Date()
                    }
                });

                if (!created) {
                    await adminUser.update({
                        name: updateData.adminName,
                        phoneNumber: updateData.adminPhone,
                        location: updateData.adminLocation || updateData.location || '',
                        category: updateData.adminCategory || updateData.category || 'Builders',
                        updatedOn: new Date()
                    });
                }
            }

            const updatedCompany = await Company.findByPk(companyID);
            res.json({ success: true, data: updatedCompany });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    createCompany: async (req, res) => {
        try {
            const company = await Company.create({ ...req.body, createdOn: new Date(), updatedOn: new Date() });
            
            // Sync Admin to User Table
            if (req.body.adminName && req.body.adminPhone) {
                await User.create({
                    name: req.body.adminName,
                    phoneNumber: req.body.adminPhone,
                    companyID: company.companyID,
                    location: req.body.adminLocation || req.body.location || '',
                    category: req.body.adminCategory || req.body.category || 'Builders',
                    isActive: 1,
                    role: 'admin',
                    password: 'Password#1',
                    createdOn: new Date(),
                    updatedOn: new Date()
                });
            }

            const freshCompany = await Company.findByPk(company.companyID);
            res.json({ success: true, data: freshCompany });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = companyController;
