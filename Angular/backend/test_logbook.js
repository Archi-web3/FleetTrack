const axios = require('axios');

const API_URL = 'http://localhost:3000/api/logbook';

async function testLogbookAPI() {
    try {
        console.log('--- TEST 1: Fetching My Trips ---');
        const tripsResponse = await axios.get(`${API_URL}/my-trips`);
        console.log('Trips fetched:', tripsResponse.data.length);
        if (tripsResponse.data.length > 0) {
            console.log('Sample Trip ID:', tripsResponse.data[0]._id);
        }

        console.log('\n--- TEST 2: Syncing Data ---');
        // Create dummy data
        const syncData = {
            trips: [], // We would put a trip ID here if we had one to update
            fuels: [{
                date: new Date(),
                vehicule: '674c7604f7f497a0465224d1', // Replace with a valid ID if needed, or mock
                chauffeur: '674c7749fbfec25232433f2e', // Replace with a valid ID
                mileage: 15000,
                quantity: 50,
                fuelType: 'Diesel',
                source: 'Station Service'
            }],
            maintenances: [{
                date: new Date(),
                vehicule: '674c7604f7f497a0465224d1',
                type: 'Preventive',
                mileage: 15000,
                tasks: [{ name: 'Oil Change', status: 'OK' }]
            }],
            incidents: [{
                date: new Date(),
                chauffeur: '674c7749fbfec25232433f2e',
                type: 'Panne',
                description: 'Test Incident from Script',
                severity: 'Faible'
            }]
        };

        // Note: The IDs above are placeholders. If they don't exist in your DB, the foreign key validation might fail 
        // or it might just save if validation is loose. 
        // Ideally we should fetch a real vehicle/driver ID first.

        // Let's try to fetch a vehicle first to make it robust
        try {
            const vehResponse = await axios.get('http://localhost:3000/api/vehicules');
            if (vehResponse.data.length > 0) {
                const vId = vehResponse.data[0]._id;
                syncData.fuels[0].vehicule = vId;
                syncData.maintenances[0].vehicule = vId;
            }

            const chaufResponse = await axios.get('http://localhost:3000/api/chauffeurs');
            if (chaufResponse.data.length > 0) {
                const cId = chaufResponse.data[0]._id;
                syncData.fuels[0].chauffeur = cId;
                syncData.incidents[0].chauffeur = cId;
            }
        } catch (e) {
            console.warn('Could not fetch real IDs, using placeholders which might fail.');
        }

        const syncResponse = await axios.post(`${API_URL}/sync`, syncData);
        console.log('Sync Response:', JSON.stringify(syncResponse.data, null, 2));

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testLogbookAPI();
