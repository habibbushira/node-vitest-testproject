/**
 * FHIRClient - A user-friendly TypeScript client for accessing FHIR resources
 * @example
 * const client = new FHIRClient('https://hapi.fhir.org/baseR4');
 * async function getPatients() {
 *   const patients = await client.patient().get({ limit: 10 });
 *   console.log(patients);
 * }
 */
class FHIRClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Access a specific FHIR resource type
   * @param resourceType - The FHIR resource type (e.g., 'Patient')
   */
  resource(resourceType: string) {
    return new FHIRResource(this.baseUrl, resourceType);
  }

  /**
   * Shortcut for Patient resource
   */
  patient() {
    return this.resource('Patient');
  }
}

/**
 * Interface for search parameters
 */
interface SearchParams {
  limit?: number;
  name?: string;
  [key: string]: string | number | undefined;
}

/**
 * FHIRResource - Handles operations for a specific FHIR resource type
 */
class FHIRResource {
  private baseUrl: string;
  private resourceType: string;

  constructor(baseUrl: string, resourceType: string) {
    this.baseUrl = baseUrl;
    this.resourceType = resourceType;
  }

  /**
   * Fetch a list of resources
   * @param params - Search parameters (e.g., { limit: 10, name: 'John' })
   */
  async get(params: SearchParams = {}): Promise<any> {
    const url = this.buildUrl(params);
    return this.fetchFHIR(url);
  }

  /**
   * Fetch a resource by ID
   * @param id - The resource ID
   */
  async getById(id: string): Promise<any> {
    const url = `${this.baseUrl}/${this.resourceType}/${id}`;
    return this.fetchFHIR(url);
  }

  /**
   * Build the FHIR URL with query parameters
   */
  private buildUrl(params: SearchParams): string {
    const query = new URLSearchParams();
    if (params.limit) query.set('_count', params.limit.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && key !== 'limit') {
        query.set(key, value.toString());
      }
    }
    return `${this.baseUrl}/${this.resourceType}?${query.toString()}`;
  }

  /**
   * Fetch data from the FHIR server
   */
  private async fetchFHIR(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch FHIR data: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch FHIR data: ${String(error)}`);
    }
  }
  }
}

// Export for Node.js usage
export default FHIRClient;