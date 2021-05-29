const AccessControl = require('accesscontrol');
let grantArray = [
	{ role: 'viewer', resource: 'facilities', action: 'read:any', attributes: '*' },
	{ role: 'viewer', resource: 'images', action: 'read:any', attributes: '*' },
	{ role: 'viewer', resource: 'templates', action: 'read:any', attributes: '*' },
	{ role: 'editor', resource: 'facilities', action: 'read:any', attributes: '*' },
	{ role: 'editor', resource: 'facilities', action: 'update:any', attributes: '*' },
	{ role: 'editor', resource: 'facilities', action: 'create:any', attributes: '*' },
	{ role: 'editor', resource: 'images', action: 'read:any', attributes: '*' },
	{ role: 'editor', resource: 'images', action: 'update:any', attributes: '*' },
	{ role: 'editor', resource: 'images', action: 'create:any', attributes: '*' },
	{ role: 'editor', resource: 'templates', action: 'read:any', attributes: '*' },
	{ role: 'admin', resource: 'facilities', action: 'read:any', attributes: '*' },
	{ role: 'admin', resource: 'facilities', action: 'update:any', attributes: '*' },
	{ role: 'admin', resource: 'facilities', action: 'create:any', attributes: '*' },
	{ role: 'admin', resource: 'facilities', action: 'delete:any', attributes: '*' },
	{ role: 'admin', resource: 'images', action: 'read:any', attributes: '*' },
	{ role: 'admin', resource: 'images', action: 'update:any', attributes: '*' },
	{ role: 'admin', resource: 'images', action: 'create:any', attributes: '*' },
	{ role: 'admin', resource: 'images', action: 'delete:any', attributes: '*' },
	{ role: 'admin', resource: 'templates', action: 'read:any', attributes: '*' },
	{ role: 'admin', resource: 'templates', action: 'update:any', attributes: '*' },
	{ role: 'admin', resource: 'templates', action: 'create:any', attributes: '*' },
	{ role: 'admin', resource: 'templates', action: 'delete:any', attributes: '*' },
	{ role: 'admin', resource: 'users', action: 'read:any', attributes: '*' },
	{ role: 'admin', resource: 'users', action: 'update:any', attributes: '*' },
	{ role: 'admin', resource: 'users', action: 'create:any', attributes: '*' },
	{ role: 'admin', resource: 'users', action: 'delete:any', attributes: '*' },
	{ role: 'admin', resource: 'reports', action: 'create:any', attributes: '*' }
]
const ac = new AccessControl(grantArray);
ac.deny('none'); // Um die Rolle 'none' zu erzeugen und definieren, aber die hat trotzdem keine Rechte.
module.exports = ac;