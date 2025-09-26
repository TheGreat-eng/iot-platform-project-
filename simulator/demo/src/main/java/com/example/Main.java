package com.example;

import com.google.gson.Gson;
import okhttp3.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class Main {
    private static final String API_URL = "http://localhost:8080/api/device-data";
    private static final String DEVICE_ID = "dev_16d3187bad5d42e6bdf423b88ba86567"; // <-- CẬP NHẬT
    private static final String SECRET_KEY = "sk_9906d59e282d4773b3a431bdfb46045d"; // <-- CẬP NHẬT
    private static final OkHttpClient client = new OkHttpClient();
    private static final Gson gson = new Gson();
    private static final Random random = new Random();

    public static void main(String[] args) {
        System.out.println("Starting IoT Device Simulator...");

        while (true) {
            try {
                // 1. Tạo dữ liệu giả
                double temperature = 31 + (4 * random.nextDouble()); // Giá trị luôn > 30 (từ 31-35)

                // 2. Tạo payload JSON
                Map<String, Object> payload = new HashMap<>();
                payload.put("deviceId", DEVICE_ID);
                payload.put("secretKey", SECRET_KEY); // <-- THÊM DÒNG NÀY
                payload.put("value", Math.round(temperature * 10.0) / 10.0); // Làm tròn 1 chữ số thập phân
                String jsonPayload = gson.toJson(payload);

                // 3. Tạo request POST
                RequestBody body = RequestBody.create(jsonPayload, MediaType.get("application/json; charset=utf-8"));
                Request request = new Request.Builder()
                        .url(API_URL)
                        .post(body)
                        .build();

                // 4. Gửi request và nhận response
                System.out.println("Sending data: " + jsonPayload);
                try (Response response = client.newCall(request).execute()) {
                    if (!response.isSuccessful()) {
                        System.err.println("Failed to send data: " + response);
                    } else {
                        System.out.println("Data sent successfully. Response: " + response.body().string());
                    }
                }

                // 5. Chờ 20 giây cho lần gửi tiếp theo
                Thread.sleep(20000);

            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
                // Chờ 10 giây nếu có lỗi trước khi thử lại
                try {
                    Thread.sleep(10000);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                }
            }
        }
    }
}