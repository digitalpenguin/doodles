<?php
class getNumRecordsProcessor extends modObjectProcessor {
    public $classKey = 'Doodle';
    public $languageTopics = array('doodles:default');
    public $defaultSortField = 'name';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'doodles.doodle';

    public function process() {
        $total = $this->modx->getCount('Doodle');
        return $total;
    }
}