const { distance, equals } = require('./util');

/**
 * Reduce number of tracks in array by reordering them and concatenating ones
 * that have either beginning or end closer than given distance to beginning
 * or end of another track.
 * Optionally reverse track if its end is closer to the beginning of another track.
 * @param {Array} tracks Array of tracks to optimize, tracks are arrays of points,
 * each point is an array of two numbers - longitude and latitude
 * @param {Number} minDistance Minimum distance in meters to concatenate tracks
 * @param {Boolean} canReverse If true, tracks can be reversed to optimize
 */
function optimize(tracks, minDistance = 10, canReverse = true) {
  if (!tracks || tracks.length <= 1) {
    return tracks;
  }
  const calcDistance = canReverse ? calcDistanceWithReverse : calcDistanceNoReverse;
  const optimizedTracks = [];
  optimizedTracks.push(tracks.shift());
  let tr1 = optimizedTracks[optimizedTracks.length - 1];
  while (tracks.length > 0) {
    let op = {
      shortestDistance: minDistance
    };
    for (let i = 0; i < tracks.length; i += 1) {
      const tr2 = tracks[i];
      op = calcDistance(tr1, tr2, i, op);
    }
    const { invert, reverse, index } = op;
    if (index === undefined) {
      optimizedTracks.push(tracks.shift());
      tr1 = optimizedTracks[optimizedTracks.length - 1];
      continue;
    }
    const tr2 = tracks.splice(index, 1)[0];
    if (reverse) {
      tr2.reverse();
    }
    if (invert) {
      if (equals(tr1[0], tr2[tr2.length - 1])) {
        tr2.pop();
      }
      Array.prototype.unshift.apply(tr1, tr2);
    } else {
      if (equals(tr1[tr1.length - 1], tr2[0])) {
        tr2.shift();
      }
      Array.prototype.push.apply(tr1, tr2);
    }
  }
  return optimizedTracks;
}

function calcDistanceWithReverse(tr1, tr2, index, prev) {
  const bg1 = tr1[0];
  const ed1 = tr1[tr1.length - 1];
  const bg2 = tr2[0];
  const ed2 = tr2[tr2.length - 1];
  const d1 = distance(bg1, bg2);
  const d2 = distance(bg1, ed2);
  const d3 = distance(ed1, bg2);
  const d4 = distance(ed1, ed2);
  const minDistance = Math.min(d1, d2, d3, d4);
  const { shortestDistance } = prev;
  if (minDistance >= shortestDistance) {
    return prev;
  }
  if (d2 === minDistance) {
    return {
      index,
      invert: true,
      shortestDistance
    };
  }
  if (d3 === minDistance) {
    return {
      index,
      shortestDistance
    };
  }
  if (d1 === minDistance) {
    return {
      index,
      invert: true,
      reverse: true,
      shortestDistance
    };
  }
  return {
    index,
    reverse: true,
    shortestDistance
  };
}

function calcDistanceNoReverse(tr1, tr2, index, prev) {
  const bg1 = tr1[0];
  const ed1 = tr1[tr1.length - 1];
  const bg2 = tr2[0];
  const ed2 = tr2[tr2.length - 1];
  const d2 = distance(bg1, ed2);
  const d3 = distance(ed1, bg2);
  const minDistance = Math.min(d2, d3);
  const { shortestDistance } = prev;
  if (minDistance >= shortestDistance) {
    return prev;
  }
  if (d2 === minDistance) {
    return {
      index,
      invert: true,
      shortestDistance
    };
  }
  return {
    index,
    shortestDistance
  };
}

module.exports = optimize;
