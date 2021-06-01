import get from 'lodash/get'

const isEqual = (a, b, instance) => {
	if (Array.isArray(a) && Array.isArray(b)) {
		if (instance && a.length !== b.length) return false
		if (!a.every((aa, i) => isEqual(aa, b[i], instance))) return false
	} else if (a.constructor.name === b.constructor.name) {
		if (!shouldSkipUpdate([instance])(a, b)) return false
	// } else if (!Array.isArray(a) && !Array.isArray(b)) {
	// 	if (a !== b) return false
	} else {
		return false
	}

	return true
}

const shouldSkipUpdate = (watched_props) => (prevProps, nextProps) => watched_props.every((prop) => {
	if (prop.includes('[]')) {
		const prop_parts = prop.split('[]').map((p) => p.replace(/^\./, ""))
		// console.info(prop_parts)
		let should_skip_update = true
		prop_parts.slice(0).reduce((sum, instance, index, array) => {
			const newPrevProps = get(sum.prevProps, instance)
			const newNextProps = get(sum.nextProps, instance)
			
			if (typeof array[index+1] === 'undefined' || (typeof newPrevProps === 'undefined' && typeof newNextProps === 'undefined')) return {
				prevProps: newPrevProps,
				nextProps: newNextProps,
			}

			const next_index = array.slice(index+1).join('[].')
			if (!isEqual(newPrevProps, newNextProps, next_index)) {
				should_skip_update = false
			}

			if (!should_skip_update) {
				array.splice(1) // Exit
			}

			return {
				prevProps: newPrevProps,
				nextProps: newNextProps,
			}
		}, {prevProps, nextProps})

		return should_skip_update
	} else {
		return prop ? get(prevProps, prop) === get(nextProps, prop) : prevProps === nextProps
	}
})

export default shouldSkipUpdate
