const fs = require('fs');
const files = [
  'src/pages/farmer/FarmerDashboard.jsx',
  'src/pages/admin/ManageFarmers.jsx',
  'src/pages/admin/DailyEntry.jsx',
  'src/pages/admin/AdminDashboard.jsx',
  'src/context/AuthContext.jsx'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/http:\/\/localhost:3001/g, '');
    fs.writeFileSync(f, content);
  }
});
