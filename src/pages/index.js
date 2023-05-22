import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  const loggedInStateToggle = (isLoggedIn) => {
  const extensionLoginBtn = document.querySelector('#button-login-mobile');
  const mobileLoginBtn = document.querySelector('#button-login-extension');
  const logoutBtn = document.querySelector('#button-logout');
  const sendBtn = document.querySelector('#button-tx');

    if (isLoggedIn) {
      extensionLoginBtn.classList.add('hidden');
      mobileLoginBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
      sendBtn.classList.remove('hidden');
    } else {
      extensionLoginBtn.classList.remove('hidden');
      mobileLoginBtn.classList.remove('hidden');
      logoutBtn.classList.add('hidden');
      sendBtn.classList.add('hidden');
    }
  };

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div>
          <p>WIP wallet buttons</p>
          <button id="button-login-mobile">xPortal</button>
          <button id="button-login-extension">Browser Extension</button>
          <button id="button-logout">Logout</button>
          <div id="qr-code-container" class="qr-code-container"></div>
          <button id="button-tx">Send</button>

        </div>
        <p>Still working to grok ElvenTools, almost finished! 🛣️🏁</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Brief HRI Tutorial
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
