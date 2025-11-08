'use client';

import Link from 'next/link';

export default function PrivacyPolicy() {
  return ( <div className="relative container mx-auto py-5 p-1">
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">

  <div className="my-8 text-sm">
        🔄{' '}
        <Link href="/privacy/en" className="text-blue-600 underline">
          Switch to English version
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>


      <p className="mb-4">
        Bei <strong>Masala Taste of India</strong> (
        <a href="https://www.masala-gf.de" className="text-blue-600 underline">
          www.masala-gf.de
        </a>
        ) nehmen wir den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung erläutert, welche Daten wir erfassen und wie wir sie verwenden.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Welche Daten erfassen wir?</h2>
      <p className="mb-4">
        Wir erfassen nur die notwendigen Informationen zur Abwicklung Ihrer Bestellung:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>E-Mail-Adresse</li>
        <li>Bestelldaten</li>
        <li><strong>Adresse</strong> (für Lieferung oder Abholung)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Verwendung Ihrer Daten</h2>
      <p className="mb-4">Wir verwenden Ihre Daten ausschließlich zur:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Abwicklung und Bestätigung Ihrer Bestellung</li>
        <li>Kontaktaufnahme bei Rückfragen</li>
        <li>Versendung von Angebots-E-Mails (wenn gewünscht)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Marketing-E-Mails</h2>
      <p className="mb-4">
        Wir senden gelegentlich Sonderangebote per E-Mail. Diese können Sie jederzeit abbestellen:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Über den Abmeldelink in jeder E-Mail</li>
        <li>Oder durch Deaktivierung der Option „Angebots-E-Mails erhalten“ beim Bestellvorgang</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Weitergabe von Daten</h2>
      <p className="mb-4">
        Ihre Daten werden <strong>niemals verkauft oder zu Werbezwecken an Dritte weitergegeben</strong>.
      </p>

      {/* <h2 className="text-xl font-semibold mt-6 mb-2">5. Datensicherheit</h2>
      <p className="mb-4">
        Ihre persönlichen Daten werden durch moderne Sicherheitsmechanismen geschützt und nur intern verarbeitet.
      </p> */}

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Ihre Rechte</h2>
      <p className="mb-4">
        Sie haben jederzeit das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten.
        Schreiben Sie uns dazu bitte an:
      </p>
      <p className="mb-4">
        📧{' '}
        <a href="mailto:info@masala-gf.de" className="text-blue-600 underline">
          info@masala-gf.de
        </a>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Kontakt</h2>
      <p className="mb-4">
        Bei Fragen zum Datenschutz stehen wir Ihnen jederzeit zur Verfügung:
        <br />
        📧{' '}
        <a href="mailto:info@masala-gf.de" className="text-blue-600 underline">
          info@masala-gf.de
        </a>
      </p>

      <p className="text-sm text-gray-500 mt-10">Zuletzt aktualisiert: {new Date().toLocaleDateString('de-DE')}</p>

    
    </div>
    </div>
  );
}
