import React, { useState } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import {
  getNewReleases,
  getFeaturedPlaylists,
  getCategories,
} from "../../../services/spotify";

export default function Discover() {
  const [newReleases, setNewReleases] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const newReleases = await getNewReleases();
      const playlists = await getFeaturedPlaylists();
      const categories = await getCategories();
      setNewReleases(newReleases);
      setPlaylists(playlists);
      setCategories(categories);
    }
    fetchData();
  }, []);

  return (
    <div className="discover">
      <DiscoverBlock
        text="RELEASED THIS WEEK"
        id="released"
        data={newReleases}
      />
      <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
      <DiscoverBlock
        text="BROWSE"
        id="browse"
        data={categories}
        imagesKey="icons"
      />
    </div>
  );
}
