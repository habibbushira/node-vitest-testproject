import { describe, beforeEach, test, expect, vi } from 'vitest';
import fetchMock from 'fetch-mock';
import FHIRClient from '../fhir-client.js';

describe('FHIRClient', () => {
  const baseUrl = 'https://hapi.fhir.org/baseR4';
  let client: FHIRClient;

  beforeEach(() => {
    fetchMock.reset();
    client = new FHIRClient(baseUrl);
  });

  test('should perform an end-to-end fetch of a patient and validate response', async () => {
    // Step 1: Setup mock server with multiple endpoints
    const patientId = '12345';
    const patientResponse = {
      resourceType: 'Patient',
      id: patientId,
      name: [{ use: 'official', family: 'Doe', given: ['John'] }],
    };

    const searchResponse = {
      resourceType: 'Bundle',
      entry: [
        { resource: patientResponse }
      ]
    };

    fetchMock
      .get(`${baseUrl}/Patient/${patientId}`, patientResponse)
      .get(`${baseUrl}/Patient?_count=1`, searchResponse);

    // Step 2: Call getById
    const resultById = await client.patient().getById(patientId);
    expect(resultById).toEqual(patientResponse);

    // Step 3: Call get with limit
    const resultWithLimit = await client.patient().get({ limit: 1 });
    expect(resultWithLimit).toEqual(searchResponse);

    // Step 4: Confirm both calls were made
    expect(fetchMock.called(`${baseUrl}/Patient/${patientId}`)).toBe(true);
    expect(fetchMock.called(`${baseUrl}/Patient?_count=1`)).toBe(true);
  });
});
