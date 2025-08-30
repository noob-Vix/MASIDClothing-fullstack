package com.codeWithMark.MASIDClothing.service;

import com.codeWithMark.MASIDClothing.dto.CaptchaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CaptchaService {

    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    private static final String GOOGLE_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";


    public boolean verifyCaptcha(String token) {
        RestTemplate restTemplate = new RestTemplate();

        String url = GOOGLE_VERIFY_URL + "?secret=" + recaptchaSecret + "&response=" + token;

        CaptchaResponse response = restTemplate.postForObject(url, null, CaptchaResponse.class);

        return response != null && response.isSuccess();
    }
}
