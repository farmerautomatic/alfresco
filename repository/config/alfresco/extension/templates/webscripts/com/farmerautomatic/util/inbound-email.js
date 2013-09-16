// Process Inbound email
function process_inbound_email(document)
{
    // Make sure document has emailed aspect
    if (document.hasAspect("cm:emailed"))
    {
        // Get email subject line
        var subjectLine = document.properties["cm:subjectline"].toLowerCase();
        logger.log("Incoming document subject line is " + subjectLine);
        if (subjectLine != null)
        {
            // Match the subject line with categories
            var fmCategories = search.luceneSearch("PATH:\"/cm:generalclassifiable/cm:Farmer_x0020_Automatic/*\"");
            if (fmCategories != null && fmCategories.length > 0)
            {
                logger.log("Farmer Automatic Categories Founded with Size " + fmCategories.length);
                var newCats = new Array();
                for (var i = 0, len = fmCategories.length; i < len; i ++)
                {
                    if (subjectLine.indexOf(fmCategories[i].properties["cm:name"].toLowerCase()) != -1)
                    {
                        newCats.push(fmCategories[i].nodeRef);
                        logger.log("Added matched category " + fmCategories[i].properties["cm:name"] + " (" + fmCategories[i].nodeRef + ")");
                    }
                }
                document.properties["cm:categories"] = newCats;
                document.save();
            }
            var currentDate = new Date();
            var currentMonthStrPadding = "";
            var currentDayStrPadding = "";

            if (currentDate.getMonth() < 9)
            {
                currentMonthStrPadding = "0";
            }
            if (currentDate.getDate() < 10)
            {
                currentDayStrPadding = "0";
            }
            var currentDateStr = currentMonthStrPadding + (currentDate.getMonth() + 1) + "-" + currentDayStrPadding + currentDate.getDate() + "-" + currentDate.getFullYear();
            var currentTimeStr = currentDate.getHours() + "-" + currentDate.getMinutes() + "-" + currentDate.getSeconds();

            // Run transformation
            var pdfDoc = document.transformDocument("application/pdf");
            logger.log("Transformed document to PDF" + pdfDoc.properties["cm:name"]);

            // Grab the archives folder
            var parentName = document.parent.properties["cm:name"];

            var archives = document.parent.parent.childByNamePath(parentName + " Archives");

            if (archives == null)
            {
                archives = document.parent.parent.childByNamePath("Archives");
            }

            if (archives != null)
            {
                logger.log("Found the archives folder.");
                // Locate my archive folder
                var originator = document.properties["cm:originator"];
                var myArchives = archives.childByNamePath(originator);
                if (myArchives == null)
                {
                    // Create archive sub-folder
                    myArchives = archives.createFolder(originator);
                }
                // Create a yyyy-mm-dd sub-folder

                var subSpace = myArchives.childByNamePath(currentDateStr);
                if (subSpace == null)
                {
                    subSpace = myArchives.createFolder(currentDateStr);
                }
                logger.log("Created sub space " + subSpace.properties["cm:name"]);
                // Create a hour-minute-second sub-sub-folder
                var subSubSpace = subSpace.childByNamePath(currentTimeStr);
                if (subSubSpace == null)
                {
                    subSubSpace = subSpace.createFolder(currentTimeStr);
                }
                logger.log("Created sub-sub space " + subSubSpace.properties["cm:name"]);
                // Move the documents over
                document.move(subSubSpace);
                logger.log("Document moved.");

                var attachments = document.assocs["cm:attachments"];
                if (attachments != null)
                {
                    for (var j = 0; j < attachments.length; j ++)
                    {
                        var attachment = attachments[j];
                        attachment.move(subSubSpace);
                        logger.log("Document moved.");
                    }
                }
            }
        }
    }
}