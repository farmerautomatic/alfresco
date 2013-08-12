package com.farmerautomatic.repo.content.metadata;

import org.alfresco.repo.content.metadata.PdfBoxMetadataExtracter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.pdf.PDFParser;

import org.alfresco.service.namespace.QName;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

/**
 * Metadata extractor for the PDF documents.
 * <pre>
 *   <b>author:</b>                 --      cm:author
 *   <b>title:</b>                  --      cm:title
 *   <b>subject:</b>                --      cm:description
 *   <b>created:</b>                --      cm:created
 *   <b>(custom metadata):</b>      --
 * </pre>
 *
 * Uses Apache Tika
 */
public class CustomPdfBoxMetadataExtracter extends PdfBoxMetadataExtracter {

    protected static Log logger = LogFactory.getLog(CustomPdfBoxMetadataExtracter.class);

    private static final String KEY_KEYWORD = "keyword";
    private static final String CUSTOM_PREFIX = "custom:";

    public CustomPdfBoxMetadataExtracter() {
        super();
    }

    @Override
    protected Parser getParser() {
        return new PDFParser();
    }

    /**
     * Allows implementation specific mappings
     * to be done.
     */
    @SuppressWarnings("deprecation")
    @Override
    protected Map<String, Serializable> extractSpecific(Metadata metadata,
                                                        Map<String, Serializable> properties,
                                                        Map<String, String> headers) {
        logger.debug("Entering custom PDF Metadata Extracter...");
        logger.debug("Keyword metadata is " + metadata.get(Metadata.KEYWORDS));
        putRawValue(KEY_KEYWORD, metadata.get(Metadata.KEYWORDS), properties);

        // Handle user-defined properties dynamically
        Map<String, Set<QName>> mapping = super.getMapping();
        for (String key : mapping.keySet()) {
            if (metadata.get(CUSTOM_PREFIX + key) != null) {
                putRawValue(key, metadata.get(CUSTOM_PREFIX + key), properties);
            }
        }
        return properties;
    }
}
