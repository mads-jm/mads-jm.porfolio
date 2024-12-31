import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Single Page Endless Scroll</title>
        <meta name="description" content="A single-page site with smooth scrolling navigation." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

           {/* Right-Side Navbar */}
      <nav className={styles.navbar}>
        <ul className={styles.navLinks}>
          <li>
            <a href="#home" className={styles.navItem}>Home</a>
          </li>
          <li>
            <a href="#about" className={styles.navItem}>About</a>
          </li>
          <li>
            <a href="#projects" className={styles.navItem}>Projects</a>
          </li>
          <li>
            <a href="#contact" className={styles.navItem}>Contact</a>
          </li>
        </ul>
      </nav>

      {/* Endless scroll sections */}
      <main className={styles.main}>
        {/* Section #1: Home */}
        <section id="home" className={styles.section}>
          <h1 className={styles.sectionTitle}>Welcome to My Page</h1>
          <p>This is the home section. Scroll down or use the nav links to explore!</p>
        </section>

        {/* Section #2: About */}
        <section id="about" className={styles.section}>
          <h1 className={styles.sectionTitle}>About Me</h1>
          <p>Here is some info about me. Keep scrolling for more!</p>
        </section>

        {/* Section #3: Projects */}
        <section id="projects" className={styles.section}>
          <h1 className={styles.sectionTitle}>Projects</h1>
          <p>List your projects here, add images or demos, and so on.</p>
          <p>Since it’s an endless scroll, you can keep adding as many sections as you like.</p>
        </section>

        {/* Section #4: Contact */}
        <section id="contact" className={styles.section}>
          <h1 className={styles.sectionTitle}>Contact</h1>
          <p>Get in touch or link to your social media, email, etc.</p>
        </section>

        {/* You can keep adding more sections, indefinitely */}
      </main>
    </div>
  )
}

export default Home
