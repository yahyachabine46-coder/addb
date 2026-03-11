// REPAIR LOGIC: Find the incorrect word
            const words = text.split(/[\s,;—\-]+/);
            let incorrectWord = "";

            // List of words the AI should IGNORE (Instructions)
            const ignoreList = ["clique", "sur", "le", "mot", "incorrect", "la", "cédille", "avec", "une", "exemples"];

            for (let word of words) {
                let lowWord = word.toLowerCase().replace(/[^a-zç]/g, "");
                
                // Skip instructions or words that are too short
                if (ignoreList.includes(lowWord) || lowWord.length <= 3) continue;

                // LOGIC: In this specific screen, "commergçial" is the error 
                // because it has a cedilla before 'i'. Cedillas ONLY go before a, o, u.
                
                // Check 1: Missing cedilla where it should be (ca, co, cu)
                const needsCedilla = (lowWord.includes("ca") || lowWord.includes("co") || lowWord.includes("cu")) && !lowWord.includes("ç");
                
                // Check 2: Extra cedilla where it shouldn't be (çi, çe)
                const wrongCedilla = (lowWord.includes("çi") || lowWord.includes("çe"));

                if (needsCedilla || wrongCedilla) {
                    incorrectWord = word;
                    break;
                }
            }
