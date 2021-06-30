import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Navbar } from "../components/navbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [searchValue, setSearch] = useState("");
  const [activeSMedia, setActiveSMedia] = useState("twitter");
  const [tweets, setTweets] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(JSON.stringify("tweets"));
    }
  });
  const [videos, setVideos] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(JSON.stringify("videos"));
    }
  });

  async function search() {
    const res = await fetch(`/api/hello`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        searchValue,
      }),
      redirect: "follow",
    });
    const searchResult = await res.json();

    console.log(searchResult);
    localStorage.setItem("tweets", JSON.stringify(searchResult.tweets));
    localStorage.setItem("videos", JSON.stringify(searchResult.videos));
    setTweets(searchResult.tweets);
    setVideos(searchResult.videos);
  }

  function handleChange(e) {
    setSearch(e.target.value);
  }

  useEffect(() => {
    setTweets(JSON.parse(localStorage.getItem("tweets")));
    setVideos(JSON.parse(localStorage.getItem("videos")));
  }, []);

  function setMedia(media) {
    setActiveSMedia(media);
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={styles.welcome}>
        <div className={styles.overlay}></div>
        <h1 className="text-light">Search The Social Media</h1>
        <input
          value={searchValue}
          onChange={handleChange}
          type="email"
          className={`${styles.searchInput} form-control mb-2`}
          id="exampleFormControlInput1"
          placeholder="Enter Your Search Term"
        />

        <button
          onClick={search}
          className={`${styles.searchButton} btn btn-primary d-block`}
          type="button"
        >
          Search
        </button>
      </div>
      <ul className="nav nav-pills mt-3 mx-auto d-flex flex-row justify-content-center">
        <li onClick={() => setMedia("twitter")} className="nav-item">
          <a
            className={`${
              activeSMedia === "twitter" ? "nav-link active" : "nav-link"
            }`}
            aria-current="page"
            href="#"
          >
            Twitter
          </a>
        </li>
        <li onClick={() => setMedia("youtube")} className="nav-item">
          <a
            className={`${
              activeSMedia === "youtube" ? "nav-link active" : "nav-link"
            }`}
            href="#"
          >
            Youtube
          </a>
        </li>
      </ul>
      <Container>
        <Row>
          <Col className={styles.mainRow}>
            {activeSMedia === "twitter"
              ? tweets?.data?.map((tweet, key) => {
                  let imgSrc;
                  tweets?.includes?.media?.forEach((media) => {
                    if (
                      media?.media_key === tweet?.attachments?.media_keys[0]
                    ) {
                      imgSrc = media?.url;
                    }
                  });

                  let username;
                  tweets?.includes?.users?.forEach((user) => {
                    if (user?.id === tweet?.author_id) {
                      username = user?.username;
                    }
                  });

                  return (
                    <Card key={key} className={styles.cardContainer}>
                      <Card.Img variant="top" src={imgSrc} />
                      <Card.Body>
                        <h6>@{username}</h6>
                        <Card.Text>{tweet.text}</Card.Text>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary mt-3"
                          href={`https:twitter.com/${username}/status/${tweet.id}`}
                        >
                          <i className="fab fa-twitter"></i> Go to Tweet
                        </a>
                      </Card.Body>
                    </Card>
                  );
                })
              : videos?.items.map((video, key) => {
                  return (
                    <Card key={key} className={styles.cardContainer}>
                      <Card.Img
                        variant="top"
                        src={video.snippet.thumbnails.high.url}
                      />
                      <Card.Body>
                        <h6>From {video.snippet.channelTitle}</h6>
                        <Card.Text>{video.snippet.description}</Card.Text>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary mt-3"
                          href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                        >
                          <i className="fab fa-youtube"></i> watch on Youtube
                        </a>
                      </Card.Body>
                    </Card>
                  );
                })}
          </Col>
        </Row>
      </Container>
    </>
  );
}
