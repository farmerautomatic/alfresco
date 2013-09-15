// Process Inbound email
function process_inbound_email(document)
{
    // Make sure document has emailed aspect
    if (document.hasAspect("cm:emailed"))
    {
        // Get email subject line
        var subjectLine = document.properties["cm:subjectline"];
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
                    if (subjectLine.indexOf(fmCategories[i].properties["cm:name"]) != -1)
                    {
                        newCats.push(fmCategories[i].nodeRef);
                        logger.log("Added matched category " + fmCategories[i].properties["cm:name"] + "("  + fmCategories[i].nodeRef + ")" );
                    }
                }
                document.properties["cm:categories"] = newCats;
                document.save();
            }
        }
    }
}