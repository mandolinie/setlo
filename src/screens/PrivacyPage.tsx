import AppLayout from "../components/layout/AppLayout"
import Footer from "../components/layout/Footer"

export default function PrivacyPage() {
  return (
    <AppLayout footer={<Footer />}>
      <main>
        <h1>Privacy Policy</h1>
        <p>Personal data (usually referred to just as "data" below) will only be processed by us to the extent necessary and for the purpose of providing a functional and user-friendly website, including its contents, and the services offered there.</p>
        <p>Per Art. 4 No. 1 of Regulation (EU) 2016/679, i.e. the General Data Protection Regulation (hereinafter referred to as the "GDPR"), "processing" refers to any operation or set of operations such as collection, recording, organization, structuring, storage, adaptation, alteration, retrieval, consultation, use, disclosure by transmission, dissemination, or otherwise making available, alignment, or combination, restriction, erasure, or destruction performed on personal data, whether by automated means or not.</p>
        <p>The following privacy policy is intended to inform you in particular about the type, scope, purpose, duration, and legal basis for the processing of such data either under our own control or in conjunction with others.</p>

        <h3>I. Information about us as controllers of your data</h3>
        <p>The party responsible for this website (the "controller") for purposes of data protection law is:<br />
          Manuel Blex<br />
          Implerstr. 58<br />
          81371 Munich<br />
          Germany
        </p>

        <h3>II. The rights of users and data subjects</h3>
        <p>With regard to the data processing to be described in more detail below, users and data subjects have the right:
          <ul>
            <li>to confirmation of whether data concerning them is being processed (Art. 15 GDPR);</li>
            <li>to correct or complete incorrect or incomplete data (Art. 16 GDPR);</li>
            <li>to deletion of data concerning them (Art. 17 GDPR) or restriction (Art. 18 GDPR);</li>
            <li>to receive copies of their data and transmit it to other controllers (Art. 20 GDPR);</li>
            <li>to file complaints with a supervisory authority (Art. 77 GDPR).</li>
          </ul>
        </p>

        <p>In addition, the controller is obliged to inform all recipients of any such corrections, deletions, or restrictions unless this is impossible or involves disproportionate effort. Likewise, under Art. 21 GDPR, users and data subjects have the right to object to the controller&apos;s future processing of their data pursuant to Art. 6 Para. 1 lit. f) GDPR.</p>

        <h3>III. Information about the data processing</h3>
        <p>Your data processed when using our website will be deleted or blocked as soon as the purpose for its storage ceases to apply, unless otherwise required by law.</p>

        <h4>Cookies</h4>

        <h5>a) Session cookies</h5>
        <p>We use cookies on our website. Cookies are small text files stored on your device by your browser. These cookies process information such as your browser, location data, or IP address. This processing makes our website more user-friendly, efficient, and secure. The legal basis is Art. 6 Para. 1 lit. b) GDPR or Art. 6 Para. 1 lit. f) GDPR depending on usage. When you close your browser, these session cookies are deleted.</p>

        <h5>b) Third-party cookies</h5>
        <p>Our website may also use cookies from third parties for analytics or functionality improvements.</p>

        <h5>c) Disabling cookies</h5>
        <p>You can disable cookies via your browser settings. However, some features of the site may not function properly.</p>

        <h4>Contact</h4>
        <p>If you contact us via email, your data will be used to process your request. The legal basis for this processing is Art. 6 Para. 1 lit. b) GDPR.</p>

        <h4>General introduction</h4>
        <p>Our website may include links to social media platforms. Data such as IP address, date, and visited pages may be collected. The legal basis is Art. 6 Para. 1 lit. f) GDPR.</p>

        <h4>Google Analytics</h4>
        <p>We use Google Analytics, a web analytics service provided by Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Google Analytics is used to analyze website usage. The legal basis is Art. 6 Para. 1 lit. f) GDPR. Google may process data such as IP address, usage behavior, and visit frequency.</p>

        <p>More information:<br />
          <a
            href="https://www.google.com/intl/de/policies/privacy/partners"
            target="_blank"
            rel="noopener nofollow"
          >
            https://www.google.com/intl/de/policies/privacy/partners
          </a>
        </p>

        <p>Opt-out:<br />
          <a
            href="https://tools.google.com/dlpage/gaoptout?hl=en"
            target="_blank"
            rel="noopener nofollow"
          >
            https://tools.google.com/dlpage/gaoptout?hl=en
          </a>
        </p>

        <p>Source:<br />
          <a
            href="https://www.generator-datenschutzerklärung.de"
            target="_blank"
            rel="noopener"
          >
            Model Data Protection Statement
          </a>{" "}
          for{" "}
          <a
            href="https://www.ratgeberrecht.eu/"
            target="_blank"
            rel="noopener"
          >
            Anwaltskanzlei Weiß &amp; Partner
          </a>
        </p>
      </main>
    </AppLayout>
  )
}