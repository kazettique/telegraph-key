import { morseMapping } from './morse.mapping';

// ref: https://stackoverflow.com/questions/43726344/js-decoding-morse-code
export default function morseDecoder(morseCode: string): string {
  const messageConverted: string[] = [];

  morseCode.split('/').map((word) => {
    word.split('*').map((letter) => {
      messageConverted.push(morseMapping[letter]);
    });

    messageConverted.push(' ');
  });

  return messageConverted.join('');
}
