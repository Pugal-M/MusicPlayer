'use server';

/**
 * @fileOverview A flow for suggesting songs based on the currently playing track.
 *
 * - suggestSongs - A function that suggests songs based on the current track.
 * - SuggestSongsInput - The input type for the suggestSongs function.
 * - SuggestSongsOutput - The return type for the suggestSongs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSongsInputSchema = z.object({
  currentTrackGenre: z.string().describe('The genre of the currently playing track.'),
  currentTrackTempo: z.string().describe('The tempo of the currently playing track.'),
  currentTrackCharacteristics: z.string().describe('The musical characteristics of the currently playing track.'),
});
export type SuggestSongsInput = z.infer<typeof SuggestSongsInputSchema>;

const SuggestSongsOutputSchema = z.object({
  suggestedSongs: z.array(z.string()).describe('A list of suggested songs based on the current track.'),
});
export type SuggestSongsOutput = z.infer<typeof SuggestSongsOutputSchema>;

export async function suggestSongs(input: SuggestSongsInput): Promise<SuggestSongsOutput> {
  return suggestSongsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSongsPrompt',
  input: {schema: SuggestSongsInputSchema},
  output: {schema: SuggestSongsOutputSchema},
  prompt: `You are a music expert. You will suggest songs based on the current track's genre, tempo, and musical characteristics.

Current Track Genre: {{{currentTrackGenre}}}
Current Track Tempo: {{{currentTrackTempo}}}
Current Track Characteristics: {{{currentTrackCharacteristics}}}

Suggest 5 songs with similar characteristics:`,
});

const suggestSongsFlow = ai.defineFlow(
  {
    name: 'suggestSongsFlow',
    inputSchema: SuggestSongsInputSchema,
    outputSchema: SuggestSongsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
