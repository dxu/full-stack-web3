import "../styles/globals.css";
import { useEffect, useMemo, useState, useCallback, useContext } from "react";
import Link from "next/link";
import { AccountContext, KontourContext } from "../context.js";
import { css } from "@emotion/css";
import "easymde/dist/easymde.min.css";

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [kontour, setKontour] = useState(null);

  const requestUserAccounts = useCallback(async () => {
    const account = await kontour?.wallets?.requestMetamaskAccounts();
    if (account) {
      setAccount(account);
    }
  }, [kontour]);

  const updateState = useCallback(async () => {
    if (kontour == null) {
      return;
    }
    const owner = await kontour.contracts.Blog.view.owner();
    setOwner(owner);
  }, [kontour]);

  useEffect(() => {
    async function setup() {
      if (kontour) {
        await requestUserAccounts();
        await updateState();
      }
    }
    document.addEventListener("KONTOUR_CONTRACTS_LOADED", () => {
      setKontour(window?.kontour);
    });
    setup();
  }, [kontour, updateState, requestUserAccounts]);

  /* eslint-disable @next/next/no-sync-scripts*/
  return (
    <div>
      <script
        type="text/javascript"
        // TODO: fill this in with your SDK from kontour.io
        src="http://localhost:8080/sdk/V0-MTg5NzU1NjFkLWM4YTAtNDdlZC1iM2M1LWE0ZDA3MWU3Nzc5Zg=="
      />
      <nav className={nav}>
        <div className={header}>
          <Link href="/">
            <a>
              <img src="/logo.svg" alt="React Logo" style={{ width: "50px" }} />
            </a>
          </Link>
          <Link href="/">
            <a>
              <div className={titleContainer}>
                <h2 className={title}>Full Stack</h2>
                <p className={description}>WEB3</p>
              </div>
            </a>
          </Link>
          {account && <p className={accountInfo}>{account}</p>}
        </div>
        <div className={linkContainer}>
          <Link href="/">
            <a className={link}>Home</a>
          </Link>
          {
            /* if the signed in user is the contract owner, we */
            /* show the nav link to create a new post */
            account.toLowerCase() === owner.toLowerCase() && (
              <Link href="/create-post">
                <a className={link}>Create Post</a>
              </Link>
            )
          }
        </div>
      </nav>
      <div className={container}>
        <KontourContext.Provider value={kontour}>
          <Component {...pageProps} />
        </KontourContext.Provider>
      </div>
    </div>
  );
}

const accountInfo = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
`;

const container = css`
  padding: 40px;
`;

const linkContainer = css`
  padding: 30px 60px;
  background-color: #fafafa;
`;

const nav = css`
  background-color: white;
`;

const header = css`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.075);
  padding: 20px 30px;
`;

const description = css`
  margin: 0;
  color: #999999;
`;

const titleContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;

const title = css`
  margin-left: 30px;
  font-weight: 500;
  margin: 0;
`;

const buttonContainer = css`
  width: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const buttonStyle = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 18px;
  padding: 16px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const link = css`
  margin: 0px 40px 0px 0px;
  font-size: 16px;
  font-weight: 400;
`;

export default MyApp;
