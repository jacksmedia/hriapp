import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Combased',
    Svg: require('@site/static/img/combased0.svg').default,
    description: (
      <>
        The blockchain SaaS company that launched on MultiversX &
        continues to shape its future. Fluent in Polygon & ETH & Shopify, too 🦾
      </>
    ),
  },
  {
    title: 'ComVerse',
    Svg: require('@site/static/img/comverse.svg').default,
    description: (
      <>
        Three genesis NFT collections that show the Combased brand
        and business evolution across the years. Holders receive regular rewards!
      </>
    ),
  },
  {
    title: 'Jewelswap',
    Svg: require('@site/static/img/jewelswap.svg').default,
    description: (
      <>
        Our flagship product, the only AMM (automated market maker) swap
        on MultiversX! 1MM TVL via the 🪄 of DeFi! Loan NFTs for capital!
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
