import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Ramp down to 0 users
    ],
};

export default function () {
    const BASE_URL = 'http://load-balancer'; // Use Docker service name

    // 1. Visit Landing Page
    let res = http.get(`${BASE_URL}/`);
    const checkRes = check(res, { 'status was 200': (r) => r.status == 200 });
    if (!checkRes) {
        console.log(`Request failed. Status: ${res.status}, Body: ${res.body}`);
    }
    sleep(1);

    // 2. Visit API Health Check (if exists) or just root API
    // Note: We are hitting the load balancer which proxies /api to backend
    // Since we don't have a dedicated health endpoint, we'll try to fetch public data if possible
    // or just check if the API root responds (might be 404 but server is reachable)

    // Let's try to register a random user (simulation)
    // const payload = JSON.stringify({
    //   email: `testuser_${__VU}_${__ITER}@example.com`,
    //   password: 'password123',
    //   name: 'Test User'
    // });

    // const params = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // };

    // res = http.post(`${BASE_URL}/api/auth/register`, payload, params);
    // check(res, { 'status was 201 or 400': (r) => r.status == 201 || r.status == 400 });

    sleep(1);
}
