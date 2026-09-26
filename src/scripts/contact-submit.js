// Pàgina /contacte: transport d'enviament del formulari, separat de la interfície (contact-form.js).
// Per connectar el servei final només cal escriure'n l'URL a `data-endpoint` del <form> (POST JSON) o substituir
// aquesta funció; la UI només espera que la promesa es resolgui (enviat) o es rebutgi (error).
// TODO: decidir el servei d'enviament (docs/INTEGRATIONS.md): anti-spam, no exposar claus al frontend, mínima recollida de dades.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** @param {{ name: string, email: string, topic: string, message: string }} data */
export async function sendProposal(data, { endpoint = '' } = {}) {
  if (!endpoint) {
    // Sense servei configurat: només en desenvolupament se simula l'èxit perquè es pugui revisar el disseny.
    // En producció falla de manera explícita: mai es fa veure que s'ha enviat una cosa que no ha sortit enlloc.
    if (import.meta.env.DEV) {
      console.info('[contacte] Enviament simulat (sense data-endpoint):', data);
      await wait(900);
      return;
    }
    throw new Error('not-configured');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`http-${response.status}`);
}
