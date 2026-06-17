const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./debug.json', 'utf8'));

console.log("=== CONFIGS ===");
data.configs.forEach(c => {
  console.log(`Pays: ${c.pays}, Base: ${c.base}`);
  c.rules.forEach(r => {
    if(r.level === 3) {
       console.log(`  Level 3 Mandatory Validators:`, r.mandatoryValidators.map(v => v.nom || v._id || v));
    }
  });
});

console.log("\n=== USERS ===");
data.users.forEach(u => {
  if (u.nom === 'Genet' || u.nom === 'CT' || u.nom === 'Coordinateur') {
    console.log(`${u.nom} ${u.prenom} | Profil: ${u.profil} | Niveau: ${u.niv} | TypeNiv: ${u.type} | Base: ${u.base}`);
  }
});
