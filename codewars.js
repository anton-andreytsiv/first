function humanReadable (seconds) {
    let hours  = Math.trunc(seconds/3600);
    let minutes = Math.trunc((seconds - hours*3600)/60);
    let second = seconds - hours*3600 - minutes*60;

    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (second < 10) second = '0' + second;
    

    return `${hours}:${minutes}:${second}`;
  }

  console.log(humanReadable(123660));