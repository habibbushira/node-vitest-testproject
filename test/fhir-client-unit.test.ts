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

  test('should fetch patient by ID', async () => {
    const mockResponse = { resourceType: 'Patient', id: '597296' };
    fetchMock.get(`${baseUrl}/Patient/597296`, mockResponse);

    const result = await client.patient().getById('597296');
    expect(result).toEqual(mockResponse);
    expect(fetchMock.called(`${baseUrl}/Patient/597296`)).toBe(true);
  });

  test('should fetch patients with limit', async () => {
    const mockResponse = { resourceType: 'Bundle', entry: [{ resource: { id: '1' } }] };
    fetchMock.get(`${baseUrl}/Patient?_count=10`, mockResponse);

    const result = await client.patient().get({ limit: 10 });
    expect(result).toEqual(mockResponse);
    expect(fetchMock.called(`${baseUrl}/Patient?_count=10`)).toBe(true);
  });
});
