import addDays from 'date-fns/addDays';

document.write(`GH Pages deploy with env vars ${addDays(new Date(), 1)}`);
