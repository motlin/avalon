import vetur from '@volar-plugins/vetur';
import prettyhtml from '@volar-plugins/prettyhtml'
import { volarPrettierPlugin } from '@volar-plugins/prettier'
export default {
	plugins: [
		vetur(),
		prettyhtml({ printWidth: 100 }),
		volarPrettierPlugin({
			languages: ['html', 'css', 'scss', 'typescript', 'javascript'],
			html: {
				breakContentsFromTags: true,
			},
			useVscodeIndentation: true,
		}),
	],
};
