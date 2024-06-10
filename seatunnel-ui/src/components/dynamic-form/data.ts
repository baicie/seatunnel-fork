export const data = {
  "name": "test",
  "forms": [{
    "label": "cursor.startup.mode",
    "field": "cursor.startup.mode",
    "defaultValue": "LATEST",
    "description": "",
    "clearable": false,
    "placeholder": "",
    "options": [{
      "label": "EARLIEST",
      "value": "EARLIEST"
    }, {
      "label": "LATEST",
      "value": "LATEST"
    }, {
      "label": "SUBSCRIPTION",
      "value": "SUBSCRIPTION"
    }, {
      "label": "TIMESTAMP",
      "value": "TIMESTAMP"
    }, {
      "label": "SPECIFIC",
      "value": "SPECIFIC"
    }],
    "type": "select"
  }, {
    "label": "cursor.stop.mode",
    "field": "cursor.stop.mode",
    "defaultValue": "NEVER",
    "description": "",
    "clearable": false,
    "placeholder": "",
    "options": [{
      "label": "LATEST",
      "value": "LATEST"
    }, {
      "label": "TIMESTAMP",
      "value": "TIMESTAMP"
    }, {
      "label": "SPECIFIC",
      "value": "SPECIFIC"
    }, {
      "label": "NEVER",
      "value": "NEVER"
    }],
    "type": "select"
  }, {
    "label": "topic-discovery.interval",
    "field": "topic-discovery.interval",
    "defaultValue": -1,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "inputType": "text",
    "type": "input"
  }, {
    "label": "poll.timeout",
    "field": "poll.timeout",
    "defaultValue": 100,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "inputType": "text",
    "type": "input"
  }, {
    "label": "poll.interval",
    "field": "poll.interval",
    "defaultValue": 50,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "inputType": "text",
    "type": "input"
  }, {
    "label": "poll.batch.size",
    "field": "poll.batch.size",
    "defaultValue": 500,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "inputType": "text",
    "type": "input"
  }, {
    "label": "test.boolean.option",
    "field": "test.boolean.option",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "options": [{
      "label": "true",
      "value": "true"
    }, {
      "label": "false",
      "value": "false"
    }],
    "type": "select"
  }, {
    "label": "schema",
    "field": "schema",
    "defaultValue": null,
    "description": "",
    "clearable": true,
    "placeholder": "",
    "inputType": "textarea",
    "type": "input"
  }, {
    "label": "test.list.option",
    "field": "test.list.option",
    "defaultValue": null,
    "description": "",
    "clearable": true,
    "placeholder": "",
    "inputType": "textarea",
    "type": "input"
  }, {
    "label": "test.list.int.option",
    "field": "test.list.int.option",
    "defaultValue": null,
    "description": "",
    "clearable": true,
    "placeholder": "",
    "inputType": "textarea",
    "type": "input"
  }, {
    "label": "test.map.option",
    "field": "test.map.option",
    "defaultValue": null,
    "description": "",
    "clearable": true,
    "placeholder": "",
    "inputType": "textarea",
    "type": "input"
  }, {
    "label": "test.string.option",
    "field": "test.string.option",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "inputType": "text",
    "type": "input"
  }, {
    "label": "admin.service-url",
    "field": "admin.service-url",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": true,
      "type": "non-empty"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "subscription.name",
    "field": "subscription.name",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": true,
      "type": "non-empty"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "client.service-url",
    "field": "client.service-url",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": true,
      "type": "non-empty"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "topic",
    "field": "topic",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": false,
      "fields": ["topic", "topic-pattern"],
      "requiredType": "mutually-exclusive"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "topic-pattern",
    "field": "topic-pattern",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": false,
      "fields": ["topic", "topic-pattern"],
      "requiredType": "mutually-exclusive"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "cursor.startup.timestamp",
    "field": "cursor.startup.timestamp",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "show": {
      "field": "cursor.startup.mode",
      "value": "TIMESTAMP"
    },
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": true,
      "type": "non-empty"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "cursor.reset.mode",
    "field": "cursor.reset.mode",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "show": {
      "field": "cursor.startup.mode",
      "value": "SUBSCRIPTION"
    },
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": true,
      "type": "non-empty"
    },
    "options": [{
      "label": "EARLIEST",
      "value": "EARLIEST"
    }, {
      "label": "LATEST",
      "value": "LATEST"
    }, {
      "label": "SUBSCRIPTION",
      "value": "SUBSCRIPTION"
    }, {
      "label": "TIMESTAMP",
      "value": "TIMESTAMP"
    }, {
      "label": "SPECIFIC",
      "value": "SPECIFIC"
    }],
    "type": "select"
  }, {
    "label": "cursor.stop.timestamp",
    "field": "cursor.stop.timestamp",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "show": {
      "field": "cursor.stop.mode",
      "value": "TIMESTAMP"
    },
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": true,
      "type": "non-empty"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "auth.params",
    "field": "auth.params",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": false,
      "fields": ["auth.params", "auth.plugin-class"],
      "requiredType": "union-non-empty"
    },
    "inputType": "text",
    "type": "input"
  }, {
    "label": "auth.plugin-class",
    "field": "auth.plugin-class",
    "defaultValue": null,
    "description": "",
    "clearable": false,
    "placeholder": "",
    "validate": {
      "trigger": ["input", "blur"],
      "message": "required",
      "required": false,
      "fields": ["auth.params", "auth.plugin-class"],
      "requiredType": "union-non-empty"
    },
    "inputType": "text",
    "type": "input"
  }]
}