import re

backend_path = "Angular/backend/routes/settings.js"
with open(backend_path, "r") as f:
    backend_code = f.read()

public_route = """// @route   GET /api/settings/public/brandSettings
// @desc    Get brand settings without authentication
// @access  Public
router.get('/public/brandSettings', async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: 'brandSettings' });
        if (!setting) {
            return res.json({ msg: 'Setting not found' }); // Return 200 with empty to not crash login
        }
        res.json(setting);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

"""

if "/public/brandSettings" not in backend_code:
    # Insert before the first router.get
    backend_code = backend_code.replace("router.get('/vehicleTypes", public_route + "router.get('/vehicleTypes")
    with open(backend_path, "w") as f:
        f.write(backend_code)

frontend_service_path = "Angular/gestion-des-deplacements/src/app/settings.service.ts"
with open(frontend_service_path, "r") as f:
    service_code = f.read()

service_code = service_code.replace("`${this.apiUrl}/brandSettings`", "`${this.apiUrl}/public/brandSettings`")

with open(frontend_service_path, "w") as f:
    f.write(service_code)

print("Backend and Frontend updated for public brand settings.")
