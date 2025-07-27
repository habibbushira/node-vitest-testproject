import FHIRClient from './fhir-client.js';

async function run() {
  const client = new FHIRClient('https://hapi.fhir.org/baseR4');
  try {
    // Fetch 10 patients
    console.log("--------------------------FETCH 10 PATIENTS ----------------------------------------");
    const patients = await client.patient().get({ limit: 10, name: 'John' });
    console.log(JSON.stringify(patients, null, 2));

    // Fetch a single patient by ID
     console.log("--------------------------FETCH pat2 PATIENTS --------------------------------------");
    const patient = await client.patient().getById('pat2');
    console.log(JSON.stringify(patient, null, 2));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error:", String(error));
    }
  }
}

run();