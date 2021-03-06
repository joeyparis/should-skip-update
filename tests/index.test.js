import shouldSkipUpdate from '../src/index'

test('should skip update if no props are given', () => {
	expect(shouldSkipUpdate(['a', 'a.b'])({},{})).toBe(true)
})

test('should skip update if no dependencies are given', () => {
	expect(shouldSkipUpdate([])({a: 1},{a: 2})).toBe(true)
})

test('should not skip update if props are different', () => {
	expect(shouldSkipUpdate(['a'])({a: 1}, {a: 2})).toBe(false)
})

test('should skip update if props change that are not in the dependency array', () => {
	expect(shouldSkipUpdate(['a'])({a: 1, b: 1}, {a: 1, b: 2})).toBe(true)
})

test('should not skip update if props change that are in the dependency array', () => {
	expect(shouldSkipUpdate(['a'])({a: 1, b: 1}, {a: 2, b: 1})).toBe(false)
})

test('should skip update if nested props don\'t change', () => {
	const prevProps = {
		a: {
			b: {
				c: 1,
				d: 2,
			},
			e: 3,
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: {
				c: 1,
				d: 3,
			},
			e: 4,
		},
		f: 5
	}

	expect(shouldSkipUpdate(['a.b.c'])(prevProps, nextProps)).toBe(true)
	expect(shouldSkipUpdate(['a.b.d'])(prevProps, nextProps)).toBe(false)
	expect(shouldSkipUpdate(['a.e'])(prevProps, nextProps)).toBe(false)
	expect(shouldSkipUpdate(['f'])(prevProps, nextProps)).toBe(false)
})

test('should skip update if all props are the same in different objects', () => {
	const prevProps = {
		a: {
			b: {
				c: 1,
				d: 2,
			},
			e: 3,
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: {
				c: 1,
				d: 2,
			},
			e: 3,
		},
		f: 4
	}

	const dependencies = [
		'a.b.c',
		'a.b.d',
		'a.e',
		'a.f',
	]

	expect(shouldSkipUpdate(dependencies)(prevProps, nextProps)).toBe(true)
})

test('should not skip update if dependency points to object instead of value', () => {
	const prevProps = {
		a: {
			b: {
				c: 1,
				d: 2,
			},
			e: 3,
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: {
				c: 1,
				d: 2,
			},
			e: 3,
		},
		f: 4
	}

	expect(shouldSkipUpdate(['a'])(prevProps, nextProps)).toBe(false)
	expect(shouldSkipUpdate(['a.b'])(prevProps, nextProps)).toBe(false)
})

test('should skip update only if specified array values are the same', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Builder'
				},
				{
					first_name: 'William',
					last_name: 'Smith',
				}
			],
			e: 3,
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Builder'
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				}
			],
			e: 3,
		},
		f: 4
	}

	expect(shouldSkipUpdate(['a.b[].first_name'])(prevProps, nextProps)).toBe(false)
	expect(shouldSkipUpdate(['a.b[].last_name'])(prevProps, nextProps)).toBe(true)
})

test('should not skip update if array dependency length changes', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith'
				},
				{
					first_name: 'William',
					last_name: 'Smith',
				}
			],
			e: 3,
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith'
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				}
			],
			e: 3,
		},
		f: 4
	}

	expect(shouldSkipUpdate(['a.b[].last_name'])(prevProps, nextProps)).toBe(false)
})

test('should skip update if nested array value doesn\'t change', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					address: {
						zip: 12345
					}
				},
				{
					first_name: 'William',
					last_name: 'Smith',
					address: {
						zip: 12345
					}
				}
			],
			e: 3,
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					address: {
						zip: 12345
					}
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
					address: {
						zip: 12345
					}
				}
			],
			e: 3,
		},
		f: 4
	}

	expect(shouldSkipUpdate(['a.b[].address.zip'])(prevProps, nextProps)).toBe(true)
})

test('should not skip update if nested array value doesn\'t change', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					address: {
						zip: 12345
					}
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
					address: {
						zip: 12345
					}
				}
			],
			e: 3,
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					address: {
						zip: 12345
					}
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
					address: {
						zip: 54321
					}
				}
			],
			e: 3,
		},
		f: 4
	}
	
	expect(shouldSkipUpdate(['a.b[].first_name'])(prevProps, nextProps)).toBe(true)
	expect(shouldSkipUpdate(['a.b[].address.zip'])(prevProps, nextProps)).toBe(false)
})

test('should skip update if array values stay the same', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith'
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				}
			],
			e: [1,2,3],
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				}
			],
			e: [1,2,3],
		},
		f: 4
	}
	
	expect(shouldSkipUpdate(['a.e[]'])(prevProps, nextProps)).toBe(true)
})

test('should not skip update if array values change class', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith'
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				}
			],
			e: [1,2,3],
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				}
			],
			e: [1,'2',3],
		},
		f: 4
	}
	
	expect(shouldSkipUpdate(['a.e[]'])(prevProps, nextProps)).toBe(false)
})

test('should not skip update if array changes class', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith'
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				}
			],
			e: [1,2,3],
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				}
			],
			e: 3,
		},
		f: 4
	}
	
	expect(shouldSkipUpdate(['a.e[]'])(prevProps, nextProps)).toBe(false)
})

test('should not skip update if array object changes', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith'
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				}
			],
			e: [1,{a: 'b'},3],
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				}
			],
			e: [1,{a: 'b'},3],
		},
		f: 4
	}
	
	expect(shouldSkipUpdate(['a.e[]'])(prevProps, nextProps)).toBe(false)
})

test('should skip update if array keeps same object', () => {
	const obj = {a: 'b'}

	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith'
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				}
			],
			e: [1,obj,3],
		},
		f: 4
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
				},
				{
					first_name: 'Bill',
					last_name: 'Smith',
				}
			],
			e: [1,obj,3],
		},
		f: 4
	}
	
	expect(shouldSkipUpdate(['a.e[]'])(prevProps, nextProps)).toBe(true)
})

test('should skip with muliple levels of arrays', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 1}, {b: 2}]
					}
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				},
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 1}, {b: 2}]
					}
				},
			],
		},
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 1}, {b: 2}]
					}
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				},
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 1}, {b: 2}]
					}
				},
			],
		},
	}

	expect(shouldSkipUpdate(['a.b[].kids.names[].a'])(prevProps, nextProps)).toBe(true)
})

test('should not skip with multiple levels of changing arrays', () => {
	const prevProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 1}, {b: 2}]
					}
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				},
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 1}, {b: 2}]
					}
				},
			],
		},
	}

	const nextProps = {
		a: {
			b: [
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 1}, {b: 2}]
					}
				},
				{
					first_name: 'Bill',
					last_name: 'Smith'
				},
				{
					first_name: 'Bob',
					last_name: 'Smith',
					kids: {
						names: [{a: 2}, {b: 2}]
					}
				},
			],
		},
	}

	expect(shouldSkipUpdate(['a.b[].kids.names[].a'])(prevProps, nextProps)).toBe(false)
})
