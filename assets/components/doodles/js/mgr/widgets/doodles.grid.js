Doodles.grid.Doodles = function(config) {
    config = config || {};

    Ext.applyIf(config,{
        id: 'doodles-grid-doodles'
        ,url: Doodles.config.connectorUrl
        ,baseParams: { action: 'mgr/doodle/getList' }
        ,fields: ['id','name','description','menu']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/doodle/updateFromGrid'
        ,autosave: true
        ,listeners: {
            render: function() {
                if (this.store.getCount() == 0) {
                    // If it is still pending attach a listener to load
                    // event for a single time to handle the selection
                    // after the store has been loaded
                    console.log('store not loaded yet');
                    this.store.on('load', function() {
                        console.log('load after render');
                        Ext.getCmp('recNum').update(this.store.getCount());
                    }, this, {
                        single: true
                    });
                } else {
                    console.log('store already loaded');

                }
            }
        }
        ,columns: [{
            header: _('id')
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 60
        },{
            header: _('doodles.name')
            ,dataIndex: 'name'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('doodles.description')
            ,dataIndex: 'description'
            ,sortable: false
            ,width: 350
            ,editor: { xtype: 'textfield' }
        }],tbar:[{
            text: _('doodles.doodle_create')
            ,handler: { xtype: 'doodles-window-doodle-create' ,blankValues: true }
        },{
            xtype: 'tbtext'
            ,id: 'recNum'
            ,itemId: 'recordNumberItem'
            ,text: 'Loading...'
            ,style: 'color:red; font-size:20px;'
        },'->',{
            xtype: 'textfield'
            ,id: 'doodles-search-filter'
            ,emptyText: _('doodles.search...')
            ,listeners: {
                'change': {fn:this.search,scope:this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: function() {
                            this.fireEvent('change',this);
                            this.blur();
                            return true;
                        }
                        ,scope: cmp
                    });
                },scope:this}
            }
        },{
            xtype: 'button'
            ,id: 'modx-artworks-filter-clear'
            ,text: _('filter_clear')
            ,listeners: {
                'click': {fn: this.clearFilter, scope: this}
            }
        }]
        ,getMenu: function() {
            return [{
                text: _('doodles.doodle_update')
                ,handler: this.updateDoodle
            },'-',{
                text: _('doodles.doodle_remove')
                ,handler: this.removeDoodle
            }];

        }

    });
    Doodles.grid.Doodles.superclass.constructor.call(this,config);
};
Ext.extend(Doodles.grid.Doodles,MODx.grid.Grid, {
    loadRecordText: function() {
        alert('loaded');
        /*this.getStore().on( 'click', function( store, records, options ) {
            alert( 'succesfully loaded' );
        } );*/
    },search: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }, clearFilter: function () {
        this.getStore().baseParams = {
            action: 'mgr/doodle/getList'
            //,'competitionId': this.config.competitionId
        };
        Ext.getCmp('doodles-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },updateDoodle: function(btn,e) {
        if (!this.updateDoodleWindow) {
            this.updateDoodleWindow = MODx.load({
                xtype: 'doodles-window-doodle-update'
                ,record: this.menu.record
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
        this.updateDoodleWindow.setValues(this.menu.record);
        this.updateDoodleWindow.show(e.target);
    }
    ,removeDoodle: function() {
        MODx.msg.confirm({
            title: _('doodles.doodle_remove')
            ,text: _('doodles.doodle_remove_confirm')
            ,url: this.config.url
            ,params: {
                action: 'mgr/doodle/remove'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success': {fn:this.refresh,scope:this}
            }
        });
    }

});
Ext.reg('doodles-grid-doodles',Doodles.grid.Doodles);


Doodles.window.UpdateDoodle = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('doodles.doodle_update')
        ,url: Doodles.config.connectorUrl
        ,baseParams: {
            action: 'mgr/doodle/update'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('doodles.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'textarea'
            ,fieldLabel: _('doodles.description')
            ,name: 'description'
            ,anchor: '100%'
        }]
    });
    Doodles.window.UpdateDoodle.superclass.constructor.call(this,config);
};
Ext.extend(Doodles.window.UpdateDoodle,MODx.Window);
Ext.reg('doodles-window-doodle-update',Doodles.window.UpdateDoodle);


Doodles.window.CreateDoodle = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('doodles.doodle_create')
        ,url: Doodles.config.connectorUrl
        ,baseParams: {
            action: 'mgr/doodle/create'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('doodles.name')
            ,name: 'name'
            ,anchor: '100%'
        },{
            xtype: 'textarea'
            ,fieldLabel: _('doodles.description')
            ,name: 'description'
            ,anchor: '100%'
        }]
    });
    Doodles.window.CreateDoodle.superclass.constructor.call(this,config);
};
Ext.extend(Doodles.window.CreateDoodle,MODx.Window);
Ext.reg('doodles-window-doodle-create',Doodles.window.CreateDoodle);