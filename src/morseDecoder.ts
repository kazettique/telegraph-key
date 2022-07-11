import { morseMapping } from './morse.mapping';

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
