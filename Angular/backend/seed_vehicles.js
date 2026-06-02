const mongoose = require('mongoose');
const Vehicle = require('./models/vehicule.model');
const Pays = require('./models/pays.model');
const Base = require('./models/base.model');

const MONGODB_URI = 'mongodb://localhost:27017/acf-logbook';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        // 1. Get a Pay and Base to assign (avoid validation errors)
        const pays = await Pays.findOne();
        const base = await Base.findOne();

        if (!pays || !base) {
            console.error('❌ No Pays or Base found. Cannot seed vehicles properly.');
            mongoose.disconnect();
            return;
        }

        console.log(`Using Pays: ${pays.nom} (${pays._id}), Base: ${base.nom}`);

        // 2. Create Dummy Vehicles
        const vehiclesData = [
            {
                immatriculation: 'CM-123-AB',
                marque: 'Toyota',
                modele: 'Land Cruiser',
                type: '4x4',
                kilometrage: 148000,
                dernierServiceKm: 145000,
                statut: 'En Service',
                pays: pays._id,
                base: base._id,
                acfCode: 'MOB-001'
            },
            {
                immatriculation: 'CM-456-XY',
                marque: 'Toyota',
                modele: 'Hilux',
                type: 'Pickup',
                kilometrage: 152000, // High consumption risk
                dernierServiceKm: 145000,
                statut: 'En Service',
                pays: pays._id,
                base: base._id,
                acfCode: 'MOB-002'
            },
            {
                immatriculation: 'CM-789-ZZ',
                marque: 'Nissan',
                modele: 'Patrol',
                type: '4x4',
                kilometrage: 49500,
                dernierServiceKm: 45000, // Due soon (500 km left)
                statut: 'En Service',
                pays: pays._id,
                base: base._id,
                acfCode: 'MOB-003'
            },
            {
                immatriculation: 'CM-999-AA',
                marque: 'Renault',
                modele: 'Duster',
                type: 'SUV',
                kilometrage: 12000,
                dernierServiceKm: 10000,
                statut: 'En Service',
                pays: pays._id,
                base: base._id,
                acfCode: 'MOB-004'
            },
            {
                immatriculation: 'CM-555-BB',
                marque: 'Toyota',
                modele: 'Prado',
                type: '4x4',
                kilometrage: 19900,
                dernierServiceKm: 15000, // VERY CLOSE/OVERDUE (4900 km since last) -> 100km left
                statut: 'En Service',
                pays: pays._id,
                base: base._id,
                acfCode: 'MOB-005'
            }
        ];

        for (const vData of vehiclesData) {
            // Check if exists
            const exists = await Vehicle.findOne({ immatriculation: vData.immatriculation });
            if (!exists) {
                await Vehicle.create(vData);
                console.log(`+ Created ${vData.immatriculation}`);
            } else {
                console.log(`. Exists ${vData.immatriculation}`);
            }
        }

        console.log('✅ Seeding complete.');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Error:', err);
    });
