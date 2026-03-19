import { test, expect, } from '@playwright/test';

test('1_POST_/api/hicaps/claim', { tag: ["@Claim"] }, async ({ request }) => {

    await request.fetch(`http://openapitest-dev.eba-dnugm7jq.ap-southeast-2.elasticbeanstalk.com/api/hicaps/claim`, {
        method: "POST",
        headers: {
  "Content-Type": "application/json"
},
        data: {
  "claimRequest": {
    "transactionId": "TXN123456789",
    "cardNumber": 7777,
    "clientNumber": 12345678,
    "providerType": "A",
    "providerNumber": "0222222P",
    "claimLines": [
      {
        "itemCode": "ITEM001",
        "customerSuffix": "01",
        "serviceDate": "2026-01-07",
        "quantity": 1,
        "chargedAmount": 120,
        "benefitAmount": 80,
        "reasonCode": "OK"
      },
      {
        "itemCode": "ITEM002",
        "customerSuffix": "01",
        "serviceDate": "2026-01-07",
        "quantity": 1,
        "chargedAmount": 120,
        "benefitAmount": 80,
        "reasonCode": "OK"
      }
    ]
  }
},
    }).then((apiResponse) => {
        expect(apiResponse.ok()).toBeTruthy();
        expect(apiResponse.status().toString()).toBe('200');
        
    });

});