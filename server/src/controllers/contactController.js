const ResponseHandler = require("../shared/response.handaler");

class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }

    // Create a new contact
    async createContact(req, res, next) {
        try {
            const result = await this.contactService.createContact(req.body);

            if (result) {
                ResponseHandler.success(res, "Contact created successfully", result);
            } else {
                ResponseHandler.error(res, "Contact creation failed");
            }
        } catch (error) {
            console.error("Error creating contact:", error);
            next(error);
        }
    }

    // Get all contacts
    async getContacts(req, res, next) {
        try {
            const result = await this.contactService.getContacts();
            ResponseHandler.success(res, "Contacts retrieved successfully", result);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            next(error);
        }
    }

    // Get a single contact by ID
    async getContactById(req, res, next) {
        try {
            const contactId = req.params.id;
            const result = await this.contactService.getContactById(contactId);

            if (result) {
                ResponseHandler.success(res, "Contact retrieved successfully", result);
            } else {
                ResponseHandler.error(res, "Contact not found", null, 404);
            }
        } catch (error) {
            console.error("Error fetching contact by ID:", error);
            next(error);
        }
    }

    // Update a contact
    async updateContact(req, res, next) {
        try {
            const contactId = req.params.id;
            const result = await this.contactService.updateContact(contactId, req.body);

            if (result) {
                ResponseHandler.success(res, "Contact updated successfully", result);
            } else {
                ResponseHandler.error(res, "Contact update failed");
            }
        } catch (error) {
            console.error("Error updating contact:", error);
            next(error);
        }
    }

    // Delete a contact by ID
    async deleteContact(req, res, next) {
        try {
            const contactId = req.params.id;
            const result = await this.contactService.deleteContact(contactId);

            if (result) {
                ResponseHandler.success(res, "Contact deleted successfully", result);
            } else {
                ResponseHandler.error(res, "Contact deletion failed");
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            next(error);
        }
    }
}

module.exports = ContactController;
