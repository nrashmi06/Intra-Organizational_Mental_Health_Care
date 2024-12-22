package com.dbms.mentalhealth.util;

import com.dbms.mentalhealth.dto.user.response.UserDataResponseDTO;
import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;

@Component
public class PdfGenerator {

    private final TemplateEngine templateEngine;

    @Autowired
    public PdfGenerator(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateUserDataPdf(UserDataResponseDTO userData) {
        Context context = new Context();
        context.setVariable("userData", userData);

        String htmlContent = templateEngine.process("user_data", context);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(htmlContent, byteArrayOutputStream);

        return byteArrayOutputStream.toByteArray();
    }
}