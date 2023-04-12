import * as queryString from "query-string";
import { last } from "ramda";
import { PeertubeVideoInfo } from "types/YoutubeTypes";
import { PeerTubeVideo } from "@celluloid/types";
import * as Constants from './Constants';

class VideoApi {
  static async getPeerTubeVideoData(
    videoUrl: string
  ): Promise<PeertubeVideoInfo> {
    var parsed = new URL(videoUrl);

    const host = parsed.host;
    const videoId = last(parsed.pathname.split("/"));

    const headers = {
      Accepts: "application/json",
    };

    const url = `https://${host}/api/v1/videos/${videoId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: new Headers(headers),
    });

    if (response.status === 200) {
      const data: PeerTubeVideo = await response.json();
      return {
        id: data.shortUUID,
        host,
        title: data.name,
        thumbnailUrl: `https://${host}${data.thumbnailPath}`,
      };
    }
    throw new Error(
      `Could not perform YouTube API request (error ${response.status})`
    );
  }

  static async getPeerTubeVideo(
    host:string,
    videoId: string,
  ): Promise<PeerTubeVideo> {
   
    const headers = {
      Accepts: "application/json",
    };

    const url = `https://${host}/api/v1/videos/${videoId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: new Headers(headers),
    });

    if (response.status === 200) {
      const data: PeerTubeVideo = await response.json();
      return data
    }
    throw new Error(
      `Could not perform YouTube API request (error ${response.status})`
    );
  }
  static add(video:any) {
    const headers = {
      'Accepts': 'application/json',
      'Content-type': 'application/json'
    };
    console.log('ad function data: ', video)

    return fetch('/api/video', {
      method: 'POST',
      headers: new Headers(headers),
      credentials: 'include',
      body: JSON.stringify({ video })
    }).then(response => {
      if (response.status === 201 || response.status === 400) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error(Constants.ERR_NOT_LOGGED_IN);
      }
      throw new Error(Constants.ERR_UNAVAILABLE);
    });
  }
  // static add(video:any) {
  //   const headers = {
  //     Accepts: 'application/json',
  //     'Content-type': 'application/json',
  //   };
  //   console.log('ad function data: ', video)
  //   return fetch('/api/video', {
  //     method: 'POST',
  //     headers: new Headers(headers),
  //     credentials: 'include',
  //     body: JSON.stringify(video), 
  //   }).then((response) => {
  //     if (response.status === 201 || response.status === 400) {
  //       return response.json();
  //     } else (response.status === 200) {
  //       return response;
  //     } throw new Error(`Could not store video (error ${response.status})`);
     
  //   });
  // }

}

export default VideoApi;
