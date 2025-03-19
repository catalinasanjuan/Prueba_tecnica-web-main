const bcrypt = require('bcrypt');

const storedHash = "$2b$10$T2BpFzezGRjTEUa.LTz/2u9P.2pVogEOHhE1APgu4DsJetcUaaLrW"; 
const passwordToCompare = "admin123"; 

bcrypt.compare(passwordToCompare, storedHash, (err, result) => {
  if (err) {
    console.error("Error comparing:", err);
  } else {
    console.log("Do the passwords match?", result); 
  }
});
