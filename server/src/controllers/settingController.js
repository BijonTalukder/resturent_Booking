const ResponseHandler = require("../shared/response.handaler");

class SettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }

    async upsertSetting(req, res, next) {
        try {
            const { key, value } = req.body;
            if (!key || value === undefined) {
                return ResponseHandler.error(res, "Key and value are required", 400);
            }
            const result = await this.settingService.upsert(key, value);
            ResponseHandler.success(res, "Setting saved successfully", result);
        } catch (error) {
            console.error("Error saving setting:", error);
            next(error);
        }
    }

    async getSetting(req, res, next) {
        try {
            const { key } = req.params;
            const result = await this.settingService.get(key);
            if (result) {
                ResponseHandler.success(res, "Setting retrieved successfully", result);
            } else {
                ResponseHandler.success(res, "Setting not found", null);
            }
        } catch (error) {
            console.error("Error fetching setting:", error);
            next(error);
        }
    }

    async getAllSettings(req, res, next) {
        try {
            const result = await this.settingService.getAll();
            ResponseHandler.success(res, "Settings retrieved successfully", result);
        } catch (error) {
            console.error("Error fetching settings:", error);
            next(error);
        }
    }
}

module.exports = SettingController;
